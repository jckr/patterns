type RendererProps = {
  width?: number;
  height?: number;
  instructions?: Array<string | Array<string>>;
};
import { Engine } from './engine';
import { useRef, useEffect } from 'react';
export const Renderer = ({
  width = 400,
  height = 400,
  instructions = [],
}: RendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Engine | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        engine.current = new Engine(ctx, instructions, 450);
        engine.current.drawConstruction();
        engine.current.draw();
      }
    }
  }, [instructions]);
  return <canvas width={width} height={height} ref={canvasRef} />;
};
