import { useEffect, useRef } from 'react';
import { WorldType } from './AudioEngine';

interface ParticleSystemProps {
  world: WorldType;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
}

export function ParticleSystem({ world }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Clear particles on world change
    particlesRef.current = [];

    // Particle generation based on world
    const createParticle = (): Particle => {
      const width = canvas.width;
      const height = canvas.height;

      switch (world) {
        case 'rain':
          return {
            x: Math.random() * width,
            y: -10,
            vx: 0,
            vy: 5 + Math.random() * 5,
            size: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4,
            color: '#7dd3fc',
            life: 1,
          };

        case 'fire':
          return {
            x: Math.random() * width,
            y: height + 10,
            vx: (Math.random() - 0.5) * 2,
            vy: -2 - Math.random() * 3,
            size: 2 + Math.random() * 4,
            opacity: 0.4 + Math.random() * 0.4,
            color: Math.random() > 0.5 ? '#fb923c' : '#f87171',
            life: 1,
          };

        case 'ice':
          return {
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: 1 + Math.random() * 2,
            size: 2 + Math.random() * 3,
            opacity: 0.4 + Math.random() * 0.3,
            color: '#e0f2fe',
            life: 1,
          };

        case 'neon':
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: 1 + Math.random() * 2,
            opacity: 0.5 + Math.random() * 0.5,
            color: ['#ec4899', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 3)],
            life: 1,
          };

        case 'ocean':
          return {
            x: Math.random() * width,
            y: height / 2 + Math.random() * (height / 2),
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: 2 + Math.random() * 3,
            opacity: 0.2 + Math.random() * 0.3,
            color: '#3b82f6',
            life: 1,
          };

        case 'forest':
          return {
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: 1 + Math.random() * 1.5,
            size: 3 + Math.random() * 4,
            opacity: 0.3 + Math.random() * 0.3,
            color: '#86efac',
            life: 1,
          };

        case 'thunder':
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: 1 + Math.random() * 2,
            opacity: 0.6 + Math.random() * 0.4,
            color: '#fbbf24',
            life: 1,
          };

        case 'cosmic':
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: 1 + Math.random() * 3,
            opacity: 0.4 + Math.random() * 0.6,
            color: ['#a78bfa', '#f0abfc', '#ffffff'][Math.floor(Math.random() * 3)],
            life: 1,
          };

        case 'desert':
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 2 + Math.random() * 2,
            vy: (Math.random() - 0.5) * 0.5,
            size: 1 + Math.random() * 2,
            opacity: 0.2 + Math.random() * 0.3,
            color: '#fbbf24',
            life: 1,
          };

        case 'void':
        default:
          return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: 1 + Math.random() * 2,
            opacity: 0.2 + Math.random() * 0.2,
            color: '#94a3b8',
            life: 1,
          };
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      const particleCount = world === 'void' ? 2 : 5;
      for (let i = 0; i < particleCount; i++) {
        if (particlesRef.current.length < 200) {
          particlesRef.current.push(createParticle());
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.005;
        particle.opacity = Math.max(0, particle.opacity * particle.life);

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Keep particle if still alive and on screen
        return (
          particle.life > 0 &&
          particle.x > -50 &&
          particle.x < canvas.width + 50 &&
          particle.y > -50 &&
          particle.y < canvas.height + 50
        );
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [world]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}
