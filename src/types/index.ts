type Draw = {
  context: CanvasRenderingContext2D;
  currentPoint: Point;
  previousPoint: Point | null;
};

type DrawLineProps = Draw & {
  color: string;
};

type Point = { x: number; y: number };

export type { Draw, Point, DrawLineProps };
