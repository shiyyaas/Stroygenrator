import { motion } from 'motion/react';
import { WorldType } from './AudioEngine';

interface PortalProps {
  id: string;
  letters: string;
  world: WorldType;
  position: { x: number; y: number };
  onClick: () => void;
  isActive: boolean;
}

export function Portal({ id, letters, world, position, onClick, isActive }: PortalProps) {
  // World colors for portal rings
  const worldColors: Record<WorldType, { ring: string; inner: string; glow: string }> = {
    void: { ring: '#64748b', inner: '#1e293b', glow: '#475569' },
    rain: { ring: '#3b82f6', inner: '#1e3a8a', glow: '#60a5fa' },
    fire: { ring: '#f97316', inner: '#7c2d12', glow: '#fb923c' },
    ice: { ring: '#06b6d4', inner: '#164e63', glow: '#22d3ee' },
    neon: { ring: '#ec4899', inner: '#831843', glow: '#f472b6' },
    ocean: { ring: '#0ea5e9', inner: '#0c4a6e', glow: '#38bdf8' },
    forest: { ring: '#22c55e', inner: '#14532d', glow: '#4ade80' },
    thunder: { ring: '#eab308', inner: '#713f12', glow: '#facc15' },
    cosmic: { ring: '#a855f7', inner: '#581c87', glow: '#c084fc' },
    desert: { ring: '#f59e0b', inner: '#78350f', glow: '#fbbf24' },
  };

  const colors = worldColors[world];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: position.x,
        y: position.y,
      }}
      whileHover={{ scale: 1.1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      onClick={onClick}
      className="absolute cursor-pointer"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-80px',
        marginTop: '-80px',
      }}
    >
      {/* Outer glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: colors.glow }}
      />

      {/* Portal ring */}
      <div className="relative w-40 h-40 rounded-full flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${colors.ring}, ${colors.glow}, ${colors.ring})`,
            padding: '3px',
          }}
        >
          <div className="w-full h-full rounded-full bg-black" />
        </motion.div>

        {/* Inner world preview */}
        <motion.div
          className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${colors.inner}, #000000)`,
          }}
        >
          {/* Particle hint */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-white/60 uppercase tracking-widest text-center"
          >
            <div className="mb-1">{letters}</div>
            <div className="text-white/40 text-xs">{world}</div>
          </motion.div>

          {/* Mini particles based on world type */}
          {world === 'rain' && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-3 bg-blue-400/50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                  }}
                  animate={{
                    y: ['0%', '150%'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}

          {world === 'fire' && (
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-orange-500/60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '0%',
                  }}
                  animate={{
                    y: ['0%', '-150%'],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}

          {world === 'ice' && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300/50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                  }}
                  animate={{
                    y: ['0%', '120%'],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}

          {world === 'neon' && (
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              style={{
                backgroundImage: `
                  linear-gradient(rgba(236, 72, 153, 0.4) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '10px 10px',
              }}
            />
          )}
        </motion.div>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/0"
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        />
      </div>
    </motion.div>
  );
}
