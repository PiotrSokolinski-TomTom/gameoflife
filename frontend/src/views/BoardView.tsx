import styled from "styled-components";
import type { Board } from "../types/board";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRandomBoard } from "../hooks/useRandomBoard";
import { CircularProgress } from "@mui/material";
import { useNextTick } from "../hooks/useNextTick";
import type { Pattern } from "../types/pattern";
import SideDrawer from "../components/SideDrawer";

const BoardCanvas = styled.canvas`
  border: 1px solid black;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  border: 2px solid gray;
`;

const Author = styled.p`
  font-size: 12px;
  bottom: 12px;
  color: gray;
  position: absolute;
`;

export function BoardView() {
  const nextTick = useNextTick();

  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [seed, setSeed] = useState<string>("");
  const [board, setBoard] = useState<Board | null>(null);
  const [simSpeed, setSimSpeed] = useState(0);
  const [cellSize, setCellSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef(false);
  const moveRef = useRef(false);
  const boardRef = useRef(board);
  const autoFollowShape = useRef(false);
  const autoResizeCanvas = useRef(false);
  const [followShape, setFollowShape] = useState(false);
  const [resizeCanvas, setResizeCanvas] = useState(false);
  const cameraRef = useRef({ x: 0, y: 0 });
  const cellSizeRef = useRef(cellSize);
  const frameRef = useRef<number | null>(null);
  const pendingCenterRef = useRef<number[] | null>(null);

  const {
    mutateAsync: randomize,
    isPending: randomizing,
    isError,
  } = useRandomBoard();

  const applyCenterAndZoom = useCallback(
    (canvas: HTMLCanvasElement, cells: number[]) => {
      if (cells.length < 2) return;

      let minX = cells[0];
      let maxX = cells[0];
      let minY = cells[1];
      let maxY = cells[1];
      for (let i = 0; i < cells.length; i += 2) {
        const cx = cells[i];
        const cy = cells[i + 1];
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
      }

      const shapeWidth = maxX - minX + 1;
      const shapeHeight = maxY - minY + 1;
      const shapeCenterX = (minX + maxX + 1) / 2;
      const shapeCenterY = (minY + maxY + 1) / 2;

      const padding = 0.9;
      const fitScale =
        Math.min(canvas.width / shapeWidth, canvas.height / shapeHeight) *
        padding;
      const scale = Math.min(100, Math.max(1, fitScale));

      cellSizeRef.current = scale;
      setCellSize(Math.round(scale * 100) / 100);

      cameraRef.current = {
        x: shapeCenterX - canvas.width / 2 / scale,
        y: shapeCenterY - canvas.height / 2 / scale,
      };
    },
    [],
  );

  const render = useCallback(() => {
    frameRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;

    if (pendingCenterRef.current) {
      applyCenterAndZoom(canvas, pendingCenterRef.current);
      pendingCenterRef.current = null;
    }

    const board = boardRef.current;
    const cells = board?.cells;

    if (
      (autoFollowShape.current || autoResizeCanvas.current) &&
      cells &&
      cells.length >= 2
    ) {
      let minX = cells[0];
      let maxX = cells[0];
      let minY = cells[1];
      let maxY = cells[1];
      for (let i = 0; i < cells.length; i += 2) {
        const cx = cells[i];
        const cy = cells[i + 1];
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
      }

      const shapeWidth = maxX - minX + 1;
      const shapeHeight = maxY - minY + 1;
      const shapeCenterX = (minX + maxX + 1) / 2;
      const shapeCenterY = (minY + maxY + 1) / 2;

      if (autoResizeCanvas.current) {
        const padding = 0.9;
        const fitScale =
          Math.min(canvas.width / shapeWidth, canvas.height / shapeHeight) *
          padding;
        const clamped = Math.min(100, Math.max(1, fitScale));
        if (Math.abs(clamped - cellSizeRef.current) > 0.01) {
          cellSizeRef.current = clamped;
          setCellSize(Math.round(clamped * 100) / 100);
        }
      }

      if (autoFollowShape.current) {
        const scale = cellSizeRef.current;
        cameraRef.current = {
          x: shapeCenterX - canvas.width / 2 / scale,
          y: shapeCenterY - canvas.height / 2 / scale,
        };
      }
    }

    const cellSize = cellSizeRef.current;
    const camera = cameraRef.current;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const startX = Math.round(-(camera.x % 1) * cellSize);
    const startY = Math.round(-(camera.y % 1) * cellSize);

    const startThickX = Math.round(-(camera.x % 10) * cellSize);
    const startThickY = Math.round(-(camera.y % 10) * cellSize);

    const startThickestX = Math.round(-(camera.x % 100) * cellSize);
    const startThickestY = Math.round(-(camera.y % 100) * cellSize);

    if (cellSize > 5) {
      ctx.beginPath();
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;

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
    if (cellSize > 2.5) {
      ctx.beginPath();
      ctx.strokeStyle = "#aaa";
      ctx.lineWidth = 1;
      for (let x = startThickX; x <= canvas.width; x += cellSize * 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = startThickY; y <= canvas.height; y += cellSize * 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }
    if (cellSize > 1.1) {
      ctx.beginPath();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      for (let x = startThickestX; x <= canvas.width; x += cellSize * 100) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = startThickestY; y <= canvas.height; y += cellSize * 100) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }

    if (!cells) return;

    ctx.fillStyle = "black";
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
  }, [applyCenterAndZoom]);

  const requestRender = useCallback(() => {
    if (frameRef.current != null) return;
    frameRef.current = requestAnimationFrame(render);
  }, [render]);

  useEffect(() => {
    boardRef.current = board;
    requestRender();
  }, [board, requestRender]);

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

  const centerAndZoom = useCallback(
    (cells: number[]) => {
      pendingCenterRef.current = cells;
      requestRender();
    },
    [requestRender],
  );

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const min = 1;
    const max = 100;
    const oldScale = cellSizeRef.current;
    const newScale =
      Math.round(
        Math.exp(
          Math.max(
            Math.log(min),
            Math.min(Math.log(max), Math.log(oldScale) - e.deltaY * 0.001),
          ),
        ) * 100,
      ) / 100;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    cameraRef.current = {
      x: cameraRef.current.x + mouseX / oldScale - mouseX / newScale,
      y: cameraRef.current.y + mouseY / oldScale - mouseY / newScale,
    };

    cellSizeRef.current = newScale;
    setCellSize(newScale);
    requestRender();
  };

  const handleAutoFollowShape = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    autoFollowShape.current = checked;
    setFollowShape(checked);
    requestRender();
  };

  const handleAutoResizeCanvas = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    autoResizeCanvas.current = checked;
    setResizeCanvas(checked);
    requestRender();
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

  const handleRandomize = useCallback(async () => {
    try {
      const next = await randomize({ width, height, seed });
      setSimSpeed(0);
      setBoard(next);
      centerAndZoom(next.cells);
    } catch (err) {
      console.error(err);
    }
  }, [randomize, width, height, seed, centerAndZoom]);

  useEffect(() => {
    void handleRandomize();
  }, []);

  if (randomizing && !board) return <CircularProgress />;
  if (isError && !board) return <p>Error</p>;

  const handleNext = async () => {
    if (!board) return;

    try {
      const next = await nextTick.mutateAsync(board);
      setBoard(next);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    if (!board) return;
    board.cells = [];
    setBoard(board);
    requestRender();
  };

  return (
    <Page>
      <Title>Game of Life</Title>
      <SideDrawer
        simSpeed={simSpeed}
        onSimSpeedChange={setSimSpeed}
        cellSize={cellSize}
        onNext={handleNext}
        autoFollowShape={followShape}
        onAutoFollowShape={handleAutoFollowShape}
        autoResizeCanvas={resizeCanvas}
        onAutoResizeCanvas={handleAutoResizeCanvas}
        onSelectPattern={loadPattern}
        width={width}
        onWidthChange={setWidth}
        height={height}
        onHeightChange={setHeight}
        seed={seed}
        onSeedChange={setSeed}
        onRandomize={handleRandomize}
        onClear={handleClear}
      />
      <BoardCanvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleOnClick}
        onWheel={handleWheel}
      />
      <Author>Piotr Sokolinski</Author>
    </Page>
  );
}
