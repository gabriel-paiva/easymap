import { useCallback, useEffect, useRef, useState } from "react";
import type { Draw, Point } from '../types';

export const useDraw = ({ color } : { color: string}) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previousPoint = useRef<null | Point>(null);

    const onMouseDown = () => setIsMouseDown(true);

    const onDraw = useCallback(({previousPoint, currentPoint, context}: Draw) => {
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
      }, [color]);

      const onClear = () => {
        const currentCanvas = canvasRef.current;
        if(!currentCanvas) return null;
        const context = currentCanvas.getContext('2d');

        if(!context) return null;

        context.clearRect(0, 0, currentCanvas.width, currentCanvas.height)
      }

    useEffect(() => {
        const currentCanvas = canvasRef.current;

        const mouseMoveHandler = (event: MouseEvent) => {
            if(!isMouseDown) return null;
            const currentPoint = computePointInCanvas(event);

            const context = currentCanvas?.getContext('2d');

            if(!context || !currentPoint) return null;

            onDraw({context, currentPoint, previousPoint: previousPoint.current});
            previousPoint.current = currentPoint;
        };

        const mouseUpHandler = () => {
            setIsMouseDown(false);
            previousPoint.current = null;
        };

        const computePointInCanvas = (event: MouseEvent): Point | null => {
            const canvas = canvasRef.current;

            if(!canvas) return null;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top

            return { x, y};
        }

        // Add event listeners
        currentCanvas?.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler)

        // Remove event listeners
        return () => {
            currentCanvas?.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouseUpHandler)
        }

    }, [onDraw, isMouseDown]);

    return { canvasRef, onMouseDown, onClear };
}
