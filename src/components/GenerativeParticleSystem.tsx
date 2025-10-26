import { useEffect, useRef } from 'react';
import { GeneratedWorld } from '../utils/WorldGenerator';

interface GenerativeParticleSystemProps {
  world: GeneratedWorld | null;
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
  angle?: number;
}

export function GenerativeParticleSystem({ world }: GenerativeParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !world) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Clear particles on world change
    particlesRef.current = [];

    // Parse colors
    const primaryColor = world.colors.primary;
    const secondaryColor = world.colors.secondary;
    const accentColor = world.colors.accent;

    // Particle generation based on world parameters
    const createParticle = (): Particle => {
      const width = canvas.width;
      const height = canvas.height;
      const params = world.particles;

      let x = 0;
      let y = 0;
      let vx = 0;
      let vy = 0;

      // Position and velocity based on direction
      switch (params.direction) {
        case 'up':
          x = Math.random() * width;
          y = height + 10;
          vx = (Math.random() - 0.5) * params.speed.min;
          vy = -params.speed.min - Math.random() * (params.speed.max - params.speed.min);
          break;

        case 'down':
          x = Math.random() * width;
          y = -10;
          vx = (Math.random() - 0.5) * params.speed.min;
          vy = params.speed.min + Math.random() * (params.speed.max - params.speed.min);
          break;

        case 'horizontal':
          x = -10;
          y = Math.random() * height;
          vx = params.speed.min + Math.random() * (params.speed.max - params.speed.min);
          vy = (Math.random() - 0.5) * params.speed.min;
          break;

        case 'radial':
          x = width / 2;
          y = height / 2;
          const angle = Math.random() * Math.PI * 2;
          const speed = params.speed.min + Math.random() * (params.speed.max - params.speed.min);
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
          break;

        case 'chaotic':
          x = Math.random() * width;
          y = Math.random() * height;
          vx = (Math.random() - 0.5) * params.speed.max;
          vy = (Math.random() - 0.5) * params.speed.max;
          break;
      }

      // Select color
      const colors = [primaryColor, secondaryColor, accentColor];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        x,
        y,
        vx,
        vy,
        size: params.size.min + Math.random() * (params.size.max - params.size.min),
        opacity: params.opacity.min + Math.random() * (params.opacity.max - params.opacity.min),
        color,
        life: 1,
        angle: Math.random() * Math.PI * 2,
      };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      const spawnRate = Math.max(1, Math.floor(world.particles.count / 100));
      for (let i = 0; i < spawnRate; i++) {
        if (particlesRef.current.length < world.particles.count) {
          particlesRef.current.push(createParticle());
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.003;
        particle.opacity = Math.max(0, particle.opacity * particle.life);

        // Motion variation
        if (world.atmosphere.motion === 'turbulent') {
          particle.vx += (Math.random() - 0.5) * 0.2;
          particle.vy += (Math.random() - 0.5) * 0.2;
        } else if (world.atmosphere.motion === 'flowing') {
          particle.vx *= 0.99;
          particle.vy *= 0.99;
        }

        // Rotate for line particles
        if (particle.angle !== undefined) {
          particle.angle += 0.02;
        }

        // Draw particle based on shape
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        switch (world.particles.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'line':
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.angle || 0);
            ctx.fillRect(-particle.size * 2, -particle.size / 4, particle.size * 4, particle.size / 2);
            ctx.restore();
            break;

          case 'square':
            ctx.fillRect(
              particle.x - particle.size / 2,
              particle.y - particle.size / 2,
              particle.size,
              particle.size
            );
            break;
        }

        // Keep particle if still alive and on screen
        return (
          particle.life > 0 &&
          particle.x > -100 &&
          particle.x < canvas.width + 100 &&
          particle.y > -100 &&
          particle.y < canvas.height + 100
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
