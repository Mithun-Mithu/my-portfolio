"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  phase: number;
};

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const createParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - 0.5) * 0.18,
  vy: (Math.random() - 0.5) * 0.18,
  radius: Math.random() * 1.8 + 0.6,
  opacity: Math.random() * 0.24 + 0.12,
  phase: Math.random() * Math.PI * 2,
});

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MOTION_QUERY);
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);

      return () => {
        mediaQuery.removeEventListener("change", updateMotionPreference);
      };
    }

    mediaQuery.addListener(updateMotionPreference);

    return () => {
      mediaQuery.removeListener(updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frameId = 0;
    let width = 0;
    let height = 0;
    let linkDistance = 120;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const isMobile = width < 768;
      const isTablet = width < 1280;
      const particleCount = isMobile ? 22 : isTablet ? 34 : 48;

      linkDistance = isMobile ? 92 : isTablet ? 112 : 132;
      particles = Array.from({ length: particleCount }, () =>
        createParticle(width, height),
      );
    };

    const animate = (time: number) => {
      if (document.hidden) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }

      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        particle.x += particle.vx + Math.cos(time * 0.00016 + particle.phase) * 0.05;
        particle.y += particle.vy + Math.sin(time * 0.00012 + particle.phase) * 0.05;

        if (particle.x < -24) particle.x = width + 24;
        if (particle.x > width + 24) particle.x = -24;
        if (particle.y < -24) particle.y = height + 24;
        if (particle.y > height + 24) particle.y = -24;

        for (let j = i + 1; j < particles.length; j += 1) {
          const neighbor = particles[j];
          const dx = particle.x - neighbor.x;
          const dy = particle.y - neighbor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance >= linkDistance) {
            continue;
          }

          const intensity = ((linkDistance - distance) / linkDistance) ** 2;
          context.strokeStyle = `rgba(125, 211, 252, ${intensity * 0.075})`;
          context.lineWidth = 0.65;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }
      }

      for (const particle of particles) {
        context.beginPath();
        context.fillStyle = `rgba(191, 219, 254, ${particle.opacity})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      frameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    frameId = window.requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020617]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 20%, rgba(59, 130, 246, 0.18), transparent 32%), radial-gradient(circle at 82% 18%, rgba(14, 165, 233, 0.12), transparent 24%), radial-gradient(circle at 72% 78%, rgba(124, 58, 237, 0.12), transparent 30%), linear-gradient(180deg, #020617 0%, #050d1a 52%, #020617 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="absolute left-[-12%] top-[-8%] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(56, 189, 248, 0.08)" }}
      />
      <div
        className="absolute bottom-[-18%] right-[-10%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(167, 139, 250, 0.08)" }}
      />
      {!prefersReducedMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-80"
        />
      ) : null}
    </div>
  );
};

export default AnimatedBackground;
