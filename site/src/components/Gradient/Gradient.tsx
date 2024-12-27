import { type FC, useEffect, useRef, useMemo } from 'react';

const SPEED = 0.02;
const BASE_R = 0;
const BASE_G = 77;
const BASE_B = 255;
const AMP_R = 30;
const AMP_G = 40;
const AMP_B = 60;
const CANVAS_SIZE = 32;

interface Props {
  className?: string;
}

const CanvasBackground: FC<Props> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const colorFuncs = useMemo(() => ({
    R: (x: number, y: number, time: number): number => (
      Math.floor(BASE_R + AMP_R * Math.sin((x * x - y * y) / 200 + time))
    ),
    G: (x: number, y: number, time: number): number => (
      Math.floor(BASE_G + AMP_G * Math.sin((x * x - y * y) / 250 + time * 1.2))
    ),
    B: (x: number, y: number, time: number): number => (
      Math.floor(BASE_B + AMP_B * Math.sin((x * x - y * y) / 300 + time * 0.8))
    )
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
    const data = imageData.data;

    const animate = () => {
      for (let x = 0; x < CANVAS_SIZE; x++) {
        for (let y = 0; y < CANVAS_SIZE; y++) {
          const index = (y * CANVAS_SIZE + x) * 4;
          data[index] = colorFuncs.R(x, y, timeRef.current);
          data[index + 1] = colorFuncs.G(x, y, timeRef.current);
          data[index + 2] = colorFuncs.B(x, y, timeRef.current);
          data[index + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      timeRef.current += SPEED;
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [colorFuncs]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  );
};

export default CanvasBackground;
export { CanvasBackground };