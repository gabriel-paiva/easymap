import { useEffect, useRef, useState } from "react";
import type { Draw, DrawLineProps, Point } from "../types";
import { io } from "socket.io-client";
import { drawLine } from "@/utils/drawLine";

const socket = io("http://localhost:3001");

export const useDraw = ({ color }: { color: string }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousPoint = useRef<null | Point>(null);

  const onMouseDown = () => setIsMouseDown(true);

  function createLine({ previousPoint, currentPoint, context }: Draw) {
    socket.emit("draw-line", { previousPoint, currentPoint, color });
    drawLine({ previousPoint, currentPoint, context, color });
  }

  const onClear = () => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return null;
    const context = currentCanvas.getContext("2d");

    if (!context) return null;

    context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        context?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ previousPoint, currentPoint, color }: DrawLineProps) => {
        if (!context) return;
        drawLine({ previousPoint, currentPoint, context, color });
      },
    );

    socket.on("clear", onClear);

    return () => {
      socket.off("client-ready");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef]);

  useEffect(() => {
    const currentCanvas = canvasRef.current;

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!isMouseDown) return null;
      const currentPoint = computePointInCanvas(event);

      const context = currentCanvas?.getContext("2d");

      if (!context || !currentPoint) return null;

      createLine({
        context,
        currentPoint,
        previousPoint: previousPoint.current,
      });
      previousPoint.current = currentPoint;
    };

    const mouseUpHandler = () => {
      setIsMouseDown(false);
      previousPoint.current = null;
    };

    const computePointInCanvas = (event: MouseEvent): Point | null => {
      const canvas = canvasRef.current;

      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      return { x, y };
    };

    // Add event listeners
    currentCanvas?.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    // Remove event listeners
    return () => {
      currentCanvas?.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [createLine, isMouseDown]);

  return { canvasRef, onMouseDown, onClear };
};
