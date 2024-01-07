import { DrawLineProps } from "@/types";

export const drawLine = ({
  previousPoint,
  currentPoint,
  context,
  color,
}: DrawLineProps) => {
  const lineColor = color;
  const lineWidth = 5;

  let startPoint = previousPoint ?? currentPoint;
  context.beginPath();
  context.lineWidth = lineWidth;
  context.strokeStyle = lineColor;
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(currentPoint.x, currentPoint.y);
  context.stroke();

  context.fillStyle = lineColor;
  context.beginPath();
  context.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
  context.fill();
};
