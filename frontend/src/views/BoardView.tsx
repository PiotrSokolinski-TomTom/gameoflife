import styled from "styled-components";
import type { Board, Coordinate } from "../types/board";
import { useEffect, useRef, useState } from "react";
import { useRandomBoard } from "../hooks/useRandomBoard";
import { Button, CircularProgress, Slider, TextField } from "@mui/material";
import { useNextTick } from "../hooks/useNextTick";
import { useParams, useSearchParams } from "react-router-dom";

const BoardCanvas = styled.canvas`
  border: 1px solid black;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SimSlider = styled(Slider)`
  width: 200px;
`;

const SimComponent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Title = styled.p`
  font-size: 32px;
  color: white;
`;

const Author = styled.p`
  font-size: 12px;
  bottom: 12px;
  color: gray;
  position: absolute;
`;

const Info = styled.p`
  font-size: 14px;
  color: white;
`;

const StyledButton = styled(Button)`
  font-size: 14px;
  background: white;
  margin: 8px;
  color: black;
`;

const TextInput = styled(TextField)`
  font-size: 14px;
  background: white;
  margin: 8px;
  color: black;
  width: 80px;
`;

const TextInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export function BoardView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const widthParam = searchParams.get("width");
  const heightParam = searchParams.get("height");
  const seedParam = searchParams.get("seed");

  const [width, setWidth] = useState(widthParam ?? "");
  const [height, setHeight] = useState(heightParam ?? "");
  const [seed, setSeed] = useState(seedParam ?? "");
  // this is disguisting, should be done on router level, but dont remember how
  useEffect(() => {
    setWidth(widthParam ?? "");
    setHeight(heightParam ?? "");
    setSeed(seedParam ?? "");
  }, [widthParam, heightParam, seedParam]);

  const {
    board: initial,
    loading,
    error,
  } = useRandomBoard(widthParam, heightParam, seedParam);

  const nextTick = useNextTick();

  const [board, setBoard] = useState<Board | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initial) {
      setBoard(initial);
    }
  }, [initial]);

  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
  });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(false);
  const moveRef = useRef(false);

  const [simSpeed, setSimSpeed] = useState(0);

  const [cellSize, setCellSize] = useState(20);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    dragRef.current = true;
    moveRef.current = false;
    lastMousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseUp = () => {
    dragRef.current = false;
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    if (!dragRef.current) return;

    moveRef.current = true;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    lastMousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setCamera((prev) => ({
      x: prev.x - dx / cellSize,
      y: prev.y - dy / cellSize,
    }));
  };

  const handleOnClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    if (!board || !canvasRef.current || moveRef.current) return;

    const boundingRect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;

    const gridX = Math.floor(x / cellSize + camera.x);
    const gridY = Math.floor(y / cellSize + camera.y);

    const key = `(${gridX}, ${gridY})` as Coordinate;

    setBoard((prev) => {
      if (!prev) return prev;

      const cells = { ...prev.cells };

      if (cells[key] === "ALIVE") {
        delete cells[key];
      } else {
        cells[key] = "ALIVE";
      }

      return {
        ...prev,
        cells,
      };
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.cancelable && e.preventDefault();
    const min = 1;
    const max = 100;
    const newSize = Math.exp(
      Math.max(
        Math.log(min),
        Math.min(Math.log(max), Math.log(cellSize) - e.deltaY * 0.001),
      ),
    );
    setCellSize(Math.round(newSize * 100) / 100);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !board) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    const gridStart = {
      x: Math.round(-(camera.x % 1) * cellSize),
      y: Math.round(-(camera.y % 1) * cellSize),
    };

    for (let x = gridStart.x; x <= canvas.width; x += cellSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }

    for (let y = gridStart.y; y <= canvas.height; y += cellSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
    // console.log(gridStart.x, gridStart.y);
    // ctx.fillStyle = "#f00";
    // ctx.fillRect(gridStart.x, gridStart.y, 10, 10);

    for (const [coordinate, state] of Object.entries(board.cells)) {
      if (state !== "ALIVE") continue;

      const [worldX, worldY] = coordinate
        .substring(1, coordinate.length - 1)
        .split(",")
        .map(Number);

      const screenX = (worldX - camera.x) * cellSize;
      const screenY = (worldY - camera.y) * cellSize;

      ctx.fillStyle = "black";
      ctx.fillRect(screenX, screenY, cellSize, cellSize);
    }
  }, [board, camera, cellSize]);

  useEffect(() => {
    if (simSpeed === 0 || !board) return;

    const interval = setInterval(async () => {
      try {
        const next = await nextTick.mutateAsync(board);
        setBoard(next);
      } catch (err) {
        console.error(err);
      }
    }, 1000 / simSpeed);

    return () => clearInterval(interval);
  }, [simSpeed, board, nextTick]); //this is really shit

  if (loading) return <CircularProgress />;
  if (error) return <p>Error</p>;

  const handleNext = async () => {
    if (!board) return;

    try {
      const next = await nextTick.mutateAsync(board);
      setBoard(next);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRandomize = () => {
    const params = new URLSearchParams();

    if (width) params.set("width", width);
    if (height) params.set("height", height);
    if (seed) params.set("seed", seed);

    setSearchParams(params);

    window.location.reload();
  };

  return (
    <Page>
      <Title>Game of Life</Title>
      <BoardCanvas
        width={1200}
        height={600}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleOnClick}
        onWheel={handleWheel}
      />
      <StyledButton aria-label="Next" onClick={handleNext}>
        Next
      </StyledButton>
      <SimComponent>
        <Info>Simulation speed</Info>
        <SimSlider
          value={simSpeed}
          onChange={(_, value) => setSimSpeed(value as number)}
          min={0}
          max={60}
        />
        <Info>{simSpeed} FPS</Info>
      </SimComponent>
      <Info>Cell size: {cellSize}</Info>
      <Author>Piotr Sokolinski</Author>
      <TextInputContainer>
        <TextInput
          aria-label="width"
          variant="outlined"
          size="small"
          placeholder="Width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        >
          Width
        </TextInput>
        <TextInput
          aria-label="height"
          variant="outlined"
          size="small"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        >
          Height
        </TextInput>
        <TextInput
          aria-label="seed"
          variant="outlined"
          size="small"
          placeholder="Seed"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        >
          Seed
        </TextInput>
        <StyledButton onClick={handleRandomize}>Randomize!</StyledButton>
      </TextInputContainer>
    </Page>
  );
}
