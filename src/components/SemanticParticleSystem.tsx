import { useEffect, useRef } from 'react';
import { SemanticWorld } from '../utils/SemanticWorldGenerator';

interface SemanticParticleSystemProps {
  world: SemanticWorld | null;
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
  rotation?: number;
  rotationSpeed?: number;
}

export function SemanticParticleSystem({ world }: SemanticParticleSystemProps) {
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

    // Particle generation based on world
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
        case 'up': // Fire, embers
          x = Math.random() * width;
          y = height + 10;
          vx = (Math.random() - 0.5) * params.speed.min;
          vy = -params.speed.min - Math.random() * (params.speed.max - params.speed.min);
          break;

        case 'down': // Rain, snow
          x = Math.random() * width;
          y = -10;
          vx = (Math.random() - 0.5) * params.speed.min * 0.3;
          vy = params.speed.min + Math.random() * (params.speed.max - params.speed.min);
          break;

        case 'horizontal': // Wind
          x = -10;
          y = Math.random() * height;
          vx = params.speed.min + Math.random() * (params.speed.max - params.speed.min);
          vy = (Math.random() - 0.5) * params.speed.min * 0.5;
          break;

        case 'swirling': // Water, magic
          const centerX = width / 2;
          const centerY = height / 2;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * Math.min(width, height) * 0.4;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
          vx = -Math.sin(angle) * params.speed.max * 0.5;
          vy = Math.cos(angle) * params.speed.max * 0.5;
          break;

        case 'chaotic': // Default
          x = Math.random() * width;
          y = Math.random() * height;
          vx = (Math.random() - 0.5) * params.speed.max;
          vy = (Math.random() - 0.5) * params.speed.max;
          break;
      }

      return {
        x,
        y,
        vx,
        vy,
        size: params.size.min + Math.random() * (params.size.max - params.size.min),
        opacity: params.opacity.min + Math.random() * (params.opacity.max - params.opacity.min),
        color: world.colors.accent,
        life: 1,
        angle: Math.random() * Math.PI * 2,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
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

        // Motion variation based on atmosphere
        if (world.atmosphere.motion === 'turbulent') {
          particle.vx += (Math.random() - 0.5) * 0.3;
          particle.vy += (Math.random() - 0.5) * 0.3;
        } else if (world.atmosphere.motion === 'flowing') {
          particle.vx *= 0.995;
          particle.vy *= 0.995;
        } else if (world.atmosphere.motion === 'gentle') {
          particle.vx += (Math.random() - 0.5) * 0.05;
          particle.vy += (Math.random() - 0.5) * 0.05;
        }

        // Rotate particles
        if (particle.rotation !== undefined && particle.rotationSpeed) {
          particle.rotation += particle.rotationSpeed;
        }

        // Draw particle based on shape
        ctx.globalAlpha = particle.opacity;

        switch (world.particles.shape) {
          case 'circle':
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'line': // Rain drops
            ctx.save();
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = particle.size * 0.4;
            ctx.translate(particle.x, particle.y);
            ctx.rotate(Math.atan2(particle.vy, particle.vx));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(particle.size * 3, 0);
            ctx.stroke();
            ctx.restore();
            break;

          case 'square':
            ctx.fillStyle = particle.color;
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation || 0);
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
            break;

          case 'leaf': // Organic shapes
            ctx.fillStyle = particle.color;
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation || 0);
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.size * 1.5, particle.size * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case 'spark': // Fire/magic sparks
            const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2);
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fill();
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
