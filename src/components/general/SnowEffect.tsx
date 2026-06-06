import { useCallback, useEffect, useRef } from "react";

interface SnowEffectProps {
  /** Mengatur kecepatan jatuhnya salju (default: 1) */
  snowSpeedFactor?: number;
}

interface Snowflake {
  x: number;
  y: number;
  opacity: number;
  speedX: number;
  speedY: number;
  radius: number;
}

export default function SnowEffect({ snowSpeedFactor = 1 }: SnowEffectProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const lastFrameRef = useRef(0);

  const getParticleCount = useCallback((width: number, height: number) => {
    const isDesktop = width > 768;
    const baseCount = isDesktop ? 150 : 80;
    const areaRatio = Math.max(0.7, Math.min((width * height) / (1440 * 900), 1.35));
    const minCount = isDesktop ? 110 : 55;
    const maxCount = isDesktop ? 220 : 120;

    return Math.max(minCount, Math.min(Math.round(baseCount * areaRatio), maxCount));
  }, []);

  const createSnowflakes = useCallback(
    (width: number, height: number): void => {
      const snowflakes: Snowflake[] = [];

      for (let i = 0; i < getParticleCount(width, height); i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          opacity: Math.random() * 0.55 + 0.25,
          speedX: (Math.random() * 0.45 - 0.225) * snowSpeedFactor,
          speedY: (Math.random() * 0.65 + 0.45) * snowSpeedFactor,
          radius: Math.random() * 1.8 + 0.9,
        });
      }

      snowflakesRef.current = snowflakes;
    },
    [getParticleCount, snowSpeedFactor],
  );

  const drawSnowflakes = useCallback((ctx: CanvasRenderingContext2D): void => {
    const { width, height } = sizeRef.current;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    snowflakesRef.current.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
    });

    ctx.fillStyle = "rgba(205, 205, 205, 0.8)";
    ctx.fill();
  }, []);

  const updateSnowflakes = useCallback((frameRatio: number): void => {
    const { width, height } = sizeRef.current;

    snowflakesRef.current = snowflakesRef.current.map((flake) => {
      let newX = flake.x + flake.speedX * frameRatio;
      let newY = flake.y + flake.speedY * frameRatio;

      if (newY > height + flake.radius) {
        newY = -flake.radius;
        newX = Math.random() * width;
      }

      if (newX > width + flake.radius) newX = -flake.radius;
      else if (newX < -flake.radius) newX = width + flake.radius;

      return { ...flake, x: newX, y: newY };
    });
  }, []);

  const animateSnow = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (timestamp: number): void => {
      const elapsed = lastFrameRef.current ? timestamp - lastFrameRef.current : 16.67;
      const frameRatio = Math.min(elapsed / 16.67, 2);

      lastFrameRef.current = timestamp;
      drawSnowflakes(ctx);
      updateSnowflakes(frameRatio);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [drawSnowflakes, updateSnowflakes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncCanvasSize = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const ctx = canvas.getContext("2d");

      sizeRef.current = { width, height, dpr };
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncCanvasSize();
    createSnowflakes(sizeRef.current.width, sizeRef.current.height);
    animateSnow();

    const handleResize = (): void => {
      syncCanvasSize();
      createSnowflakes(sizeRef.current.width, sizeRef.current.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animateSnow, createSnowflakes]);

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      className="fixed inset-0 z-[1] h-screen w-screen"
      style={{ pointerEvents: "none" }}
    />
  );
}
