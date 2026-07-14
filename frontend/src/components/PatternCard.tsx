import { useEffect, useRef } from "react";
import styled from "styled-components";
import type { Pattern } from "../types/pattern";

const PREVIEW_SIZE = 90;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #2b2b2b;
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  width: 130px;
  transition: 0.2s;

  &:hover {
    border-color: #888;
    background: #363636;
    transform: scale(1.3);
  }
`;

const Preview = styled.canvas`
  background: white;
  border-radius: 4px;
`;

const Name = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: 13px;
  text-align: center;
  width:120px;
  text-overflow: ellipsis;
  overflow:hidden;
`;

const Meta = styled.span`
  font-family: "Courier New", Courier, monospace;
  font-size: 10px;
  color: #aaa;
  text-align: center;
`;

const occurrenceFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatOccurrences(value: string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return occurrenceFormat.format(n);
}

export function PatternCard({
  pattern,
  onLoad,
}: {
  pattern: Pattern;
  onLoad: (pattern: Pattern) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    const { width, height, cells } = pattern;
    const span = Math.max(width, height) + 1;
    const cell = PREVIEW_SIZE / span;
    const offsetX = (PREVIEW_SIZE - width * cell) / 2;
    const offsetY = (PREVIEW_SIZE - height * cell) / 2;

    ctx.fillStyle = "black";
    for (let i = 0; i < cells.length; i += 2) {
      ctx.fillRect(
        offsetX + cells[i] * cell,
        offsetY + cells[i + 1] * cell,
        Math.max(cell - 0.5, 1),
        Math.max(cell - 0.5, 1),
      );
    }
  }, [pattern]);

  const label = pattern.name ?? pattern.apgcode;

  return (
    <Card onClick={() => onLoad(pattern)} title={`Load ${pattern.apgcode}`}>
      <Preview ref={canvasRef} width={PREVIEW_SIZE} height={PREVIEW_SIZE} />
      <Name>{label}</Name>
      <Meta>
        {pattern.width}x{pattern.height} - seen{" "}
        {formatOccurrences(pattern.occurrences)}
      </Meta>
    </Card>
  );
}
