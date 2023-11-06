type PatternRendererProps = {
  width?: number;
  height?: number;
  instructions?: Array<string|Array<string>>;
};
import { Pattern } from './pattern';
import {useRef, useEffect} from 'react';
export const PatternRenderer = ({
  width = 400,
  height = 400,
  instructions = [],
}: PatternRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pattern = useRef<Pattern | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        pattern.current = new Pattern(ctx, instructions, 450);
        pattern.current.drawConstruction();
        pattern.current.draw();
      }
    }
  }, [instructions]);
  return <canvas width={width} height={height} ref={canvasRef} />;

} 