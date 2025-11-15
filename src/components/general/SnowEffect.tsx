import { useRef, useEffect } from "react";

// ==== Types ====
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

// ==== Komponen utama ====
export default function SnowEffect({ snowSpeedFactor = 1 }: SnowEffectProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationRef = useRef<number | null>(null);

  const PARTICLE_COUNT = window.innerWidth > 768 ? 100 : 50;

  // Membuat partikel salju awal
  const createSnowflakes = (): void => {
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random(),
        speedX: (Math.random() * 1 - 0.5) * snowSpeedFactor,
        speedY: (Math.random() * 1 + 0.5) * snowSpeedFactor,
        radius: Math.random() * 2 + 1,
      });
    }
    snowflakesRef.current = snowflakes;
  };

  // Menggambar partikel salju
  const drawSnowflakes = (ctx: CanvasRenderingContext2D): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.beginPath();

    snowflakesRef.current.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
    });

    ctx.fillStyle = "rgba(205, 205, 205, 0.8)";
    ctx.fill();
  };

  // Memperbarui posisi partikel salju
  const updateSnowflakes = (): void => {
    snowflakesRef.current = snowflakesRef.current.map((flake) => {
      let newX = flake.x + flake.speedX;
      let newY = flake.y + flake.speedY;

      if (newY > window.innerHeight) {
        newY = 0;
        newX = Math.random() * window.innerWidth;
      }

      if (newX > window.innerWidth) newX = 0;
      else if (newX < 0) newX = window.innerWidth;

      return { ...flake, x: newX, y: newY };
    });
  };

  // Loop animasi salju
  const animateSnow = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (): void => {
      drawSnowflakes(ctx);
      updateSnowflakes();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Inisialisasi efek salju
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createSnowflakes();
    animateSnow();

    const handleResize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createSnowflakes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: "none" }}
    ></canvas>
  );
}
