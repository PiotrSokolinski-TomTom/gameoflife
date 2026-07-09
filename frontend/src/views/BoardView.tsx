import styled from "styled-components";
import type { Board } from "../types/board";
import { useEffect, useRef, useState } from "react";
import { useRandomBoard } from "../hooks/useRandomBoard";
import { Button, CircularProgress } from "@mui/material";
import { useNextTick } from "../hooks/useNextTick";
import { useParams } from "react-router-dom";

const BoardCanvas = styled.canvas`
  border: 1px solid black;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CELL_SIZE = 20; //20px x 20px

export function BoardView() {
  const { widthParam, heightParam, seedParam } = useParams();

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

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    dragRef.current = true;
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

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    lastMousePosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setCamera((prev) => ({
      x: prev.x - dx / CELL_SIZE,
      y: prev.y - dy / CELL_SIZE,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !board) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const [coordinate, state] of Object.entries(board.cells)) {
      if (state !== "ALIVE") continue;

      const [worldX, worldY] = coordinate
        .substring(1, coordinate.length - 1)
        .split(",")
        .map(Number);

      const screenX = (worldX - camera.x) * CELL_SIZE;
      const screenY = (worldY - camera.y) * CELL_SIZE;

      ctx.fillStyle = "black";
      ctx.fillRect(screenX, screenY, CELL_SIZE, CELL_SIZE);
    }
  }, [board, camera]);

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

  return (
    <Page>
      <BoardCanvas
        width={900}
        height={600}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <Button
        aria-label="Next"
        onClick={handleNext}
        disabled={nextTick.isPending}
      >
        Next
      </Button>
    </Page>
  );
}
