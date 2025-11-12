import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const SnowEffect = ({ snowSpeedFactor = 1 }) => {
  // snowSpeedFactor untuk kontrol kecepatan
  const canvasRef = useRef(null);
  const snowflakesRef = useRef([]);
  const animationRef = useRef(null);

  const PARTICLE_COUNT = window.innerWidth > 768 ? 100 : 50;

  const createSnowflakes = () => {
    const snowflakes = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random(),
        speedX: (Math.random() * 1 - 0.5) * snowSpeedFactor, // Menggunakan snowSpeedFactor
        speedY: (Math.random() * 1 + 0.5) * snowSpeedFactor, // Menggunakan snowSpeedFactor
        radius: Math.random() * 2 + 1,
      });
    }
    snowflakesRef.current = snowflakes;
  };

  const drawSnowflakes = (ctx) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.beginPath();
    snowflakesRef.current.forEach((flake) => {
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true);
    });
    ctx.fillStyle = "rgba(205, 205, 205, 0.8)";
    ctx.fill();
  };

  const updateSnowflakes = () => {
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

  const animateSnow = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      drawSnowflakes(ctx);
      updateSnowflakes();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createSnowflakes();
    animateSnow();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createSnowflakes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: "none" }}
    ></canvas>
  );
};

// Validasi propTypes
SnowEffect.propTypes = {
  snowSpeedFactor: PropTypes.number, // Mengatur kecepatan salju (default = 1)
};

export default SnowEffect;
