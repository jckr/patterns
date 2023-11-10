type RendererProps = {
  width?: number;
  height?: number;
  symmetry?: number;
  instructions?: Array<string | Array<string>>;
};
import { Engine } from './engine';
import { useRef, useEffect } from 'react';
export const Renderer = ({
  width = 400,
  height = 400,
  instructions = [],
  symmetry = 1,
}: RendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        engine.current = new Engine(ctx, instructions, { size: 450 });
        engine.current.drawConstruction(symmetry);
        engine.current.draw(symmetry);
      }
    }
  }, [instructions, symmetry]);
  return <canvas width={width} height={height} ref={canvasRef} />;
};
