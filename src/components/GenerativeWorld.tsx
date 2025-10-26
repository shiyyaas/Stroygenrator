import { motion } from 'motion/react';
import { GeneratedWorld } from '../utils/WorldGenerator';

interface GenerativeWorldProps {
  world: GeneratedWorld | null;
}

export function GenerativeWorld({ world }: GenerativeWorldProps) {
  if (!world) {
    return (
      <div className="fixed inset-0 bg-black" />
    );
  }

  const { colors, atmosphere } = world;

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        key={`gradient-${world.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 40%, ${colors.primary}, ${colors.background} 60%, #000000)`,
        }}
      />

      {/* Secondary gradient layer */}
      <motion.div
        key={`gradient-2-${world.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 60%, ${colors.secondary}, transparent 50%)`,
        }}
      />

      {/* Accent overlay */}
      <motion.div
        key={`accent-${world.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colors.accent} 0%, transparent 70%)`,
        }}
      />

      {/* Animated glow orbs */}
      <motion.div
        key={`glow-1-${world.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: atmosphere.motion === 'pulsing' ? [1, 1.3, 1] : [1, 1.1, 1],
          x: atmosphere.motion === 'flowing' ? [0, 100, 0] : 0,
          y: atmosphere.motion === 'flowing' ? [0, -50, 0] : 0,
        }}
        transition={{
          duration: atmosphere.motion === 'turbulent' ? 4 : 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          backgroundColor: colors.glow,
          opacity: 0.4,
        }}
      />

      <motion.div
        key={`glow-2-${world.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.15, 0.4, 0.15],
          scale: atmosphere.motion === 'pulsing' ? [1.2, 0.9, 1.2] : [1.1, 0.9, 1.1],
          x: atmosphere.motion === 'flowing' ? [0, -80, 0] : 0,
          y: atmosphere.motion === 'flowing' ? [0, 60, 0] : 0,
        }}
        transition={{
          duration: atmosphere.motion === 'turbulent' ? 5 : 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl"
        style={{
          backgroundColor: colors.secondary,
          opacity: 0.3,
        }}
      />

      {/* Turbulent effect */}
      {atmosphere.motion === 'turbulent' && (
        <motion.div
          key="turbulent"
          animate={{
            opacity: [0, 0.2, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle, ${colors.accent} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Calm ripples */}
      {atmosphere.motion === 'calm' && (
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor: colors.glow,
                borderWidth: '1px',
              }}
              animate={{
                width: ['0px', '800px'],
                height: ['0px', '800px'],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 2.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
