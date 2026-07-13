import styled from "styled-components";
import type { Board } from "../types/board";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRandomBoard } from "../hooks/useRandomBoard";
import { Button, CircularProgress, Slider, TextField } from "@mui/material";
import { useNextTick } from "../hooks/useNextTick";
import { useSearchParams } from "react-router-dom";
import { PatternLibrary } from "../components/PatternLibrary";
import type { Pattern } from "../types/pattern";

const BoardCanvas = styled.canvas`
  border: 1px solid black;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
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
  position: absolute;
  font-size: 32px;
  color: white;
  margin: 0;
  background: #000000;
  padding: 16px;
  border-radius: 64px;
  top: 12px;
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
  const [simSpeed, setSimSpeed] = useState(0);
  const [cellSize, setCellSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(false);
  const moveRef = useRef(false);
  const boardRef = useRef(board);
  const cameraRef = useRef({ x: 0, y: 0 });
  const cellSizeRef = useRef(cellSize);
  const frameRef = useRef<number | null>(null);

  const render = useCallback(() => {
    frameRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;

    const cellSize = cellSizeRef.current;
    const camera = cameraRef.current;
    const board = boardRef.current;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (cellSize > 5) {
      ctx.beginPath();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;

      const startX = Math.round(-(camera.x % 1) * cellSize);
      const startY = Math.round(-(camera.y % 1) * cellSize);

      for (let x = startX; x <= canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = startY; y <= canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }

    if (!board) return;

    ctx.fillStyle = "black";
    const cells = board.cells;
    for (let i = 0; i < cells.length; i += 2) {
      const screenX = (cells[i] - camera.x) * cellSize;
      const screenY = (cells[i + 1] - camera.y) * cellSize;

      if (
        screenX + cellSize < 0 ||
        screenY + cellSize < 0 ||
        screenX > canvas.width ||
        screenY > canvas.height
      ) {
        continue;
      }

      ctx.fillRect(screenX, screenY, cellSize, cellSize);
    }
  }, []);

  const requestRender = useCallback(() => {
    if (frameRef.current != null) return;
    frameRef.current = requestAnimationFrame(render);
  }, [render]);

  useEffect(() => {
    boardRef.current = board;
    requestRender();
  }, [board, requestRender]);

  useEffect(() => {
    cellSizeRef.current = cellSize;
    requestRender();
  }, [cellSize, requestRender]);

  useEffect(
    () => () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    },
    [],
  );

  const loadPattern = useCallback(
    (pattern: Pattern) => {
      setSimSpeed(0);
      setBoard({ cells: [...pattern.cells] });

      const canvas = canvasRef.current;
      const scale = cellSizeRef.current;
      if (canvas) {
        cameraRef.current = {
          x: pattern.width / 2 - canvas.width / 2 / scale,
          y: pattern.height / 2 - canvas.height / 2 / scale,
        };
      }
      requestRender();
    },
    [requestRender],
  );

  useEffect(() => {
    if (initial) {
      setBoard(initial);
    }
  }, [initial]);

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

    const scale = cellSizeRef.current;
    cameraRef.current = {
      x: cameraRef.current.x - dx / scale,
      y: cameraRef.current.y - dy / scale,
    };
    requestRender();
  };

  const handleOnClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    if (!board || !canvasRef.current || moveRef.current) return;

    const boundingRect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;

    const camera = cameraRef.current;
    const scale = cellSizeRef.current;
    const gridX = Math.floor(x / scale + camera.x);
    const gridY = Math.floor(y / scale + camera.y);

    setBoard((prev) => {
      if (!prev) return prev;

      let index = -1;
      for (let i = 0; i < prev.cells.length; i += 2) {
        if (prev.cells[i] === gridX && prev.cells[i + 1] === gridY) {
          index = i;
          break;
        }
      }

      const cells =
        index === -1
          ? [...prev.cells, gridX, gridY]
          : [...prev.cells.slice(0, index), ...prev.cells.slice(index + 2)];

      return {
        ...prev,
        cells,
      };
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
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

  const { mutateAsync: requestNextTick } = nextTick;

  useEffect(() => {
    if (simSpeed === 0) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timer = setTimeout(runTick, 1000 / simSpeed);
    };

    const runTick = async () => {
      const current = boardRef.current;
      if (!current) {
        scheduleNext();
        return;
      }
      try {
        const next = await requestNextTick(current);
        if (!cancelled) setBoard(next);
      } catch (err) {
        console.error(err);
      }
      if (!cancelled) scheduleNext();
    };

    scheduleNext();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [simSpeed, requestNextTick]);

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
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleOnClick}
        onWheel={handleWheel}
      />
      {/* <StyledButton aria-label="Next" onClick={handleNext}>
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
      <Info>Cell size: {cellSize.toFixed(2)}</Info>
      <PatternLibrary onSelect={loadPattern} />
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
      </TextInputContainer> */}
      <Author>Piotr Sokolinski</Author>
    </Page>
  );
}
