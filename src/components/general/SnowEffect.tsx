import { useRef, useEffect } from "react";

const SNOW_BOTTOM_MARGIN = 32;

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
  const snowHeightRef = useRef(0);

  const getSnowHeight = () => {
    const footer = document.querySelector('footer[role="contentinfo"]');
    const wrapper = document.querySelector(".site-wrapper");
    const target = footer || wrapper;

    if (!target) {
      return window.innerHeight;
    }

    const targetBottom = target.getBoundingClientRect().bottom + window.scrollY;

    return Math.ceil(targetBottom + SNOW_BOTTOM_MARGIN);
  };

  const getParticleCount = () => {
    const viewportCount = window.innerWidth > 768 ? 180 : 90;
    const heightRatio = Math.max(1, snowHeightRef.current / Math.max(window.innerHeight, 1));

    return Math.min(Math.ceil(viewportCount * heightRatio * 0.55), window.innerWidth > 768 ? 420 : 220);
  };

  // Membuat partikel salju awal
  const createSnowflakes = (): void => {
    const snowflakes: Snowflake[] = [];
    for (let i = 0; i < getParticleCount(); i++) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * snowHeightRef.current,
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
    ctx.clearRect(0, 0, window.innerWidth, snowHeightRef.current);
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

      if (newY > snowHeightRef.current) {
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

    const syncCanvasSize = (): void => {
      snowHeightRef.current = getSnowHeight();
      canvas.width = window.innerWidth;
      canvas.height = snowHeightRef.current;
      canvas.style.height = `${snowHeightRef.current}px`;
    };

    syncCanvasSize();

    createSnowflakes();
    animateSnow();

    const handleResize = (): void => {
      syncCanvasSize();
      createSnowflakes();
    };

    const resizeObserver = new ResizeObserver(() => {
      const nextHeight = getSnowHeight();

      if (Math.abs(nextHeight - snowHeightRef.current) < 24) {
        return;
      }

      syncCanvasSize();
      createSnowflakes();
    });

    window.addEventListener("resize", handleResize);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 z-0 w-full"
      style={{ pointerEvents: "none" }}
    ></canvas>
  );
}
