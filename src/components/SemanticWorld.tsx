import { motion } from 'motion/react';
import { SemanticWorld as SemanticWorldType } from '../utils/SemanticWorldGenerator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SemanticWorldProps {
  world: SemanticWorldType | null;
}

export function SemanticWorld({ world }: SemanticWorldProps) {
  if (!world) {
    return <div className="fixed inset-0 bg-black" />;
  }

  const { colors, atmosphere, category, imageUrl } = world;

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background image */}
      <motion.div
        key={`image-${world.id}`}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3 }}
        className="absolute inset-0"
      >
        <ImageWithFallback
          src={imageUrl}
          alt={world.theme}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Color tint overlay */}
      <motion.div
        key={`tint-${world.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-0"
        style={{
          background: atmosphere.lighting === 'bright'
            ? `linear-gradient(to bottom, ${colors.secondary}80, ${colors.primary}60 50%, ${colors.background}40)`
            : atmosphere.lighting === 'dim'
            ? `radial-gradient(ellipse at top, ${colors.background}60, transparent 70%)`
            : `radial-gradient(circle at 40% 40%, ${colors.primary}50, ${colors.background}30 60%, transparent)`,
        }}
      />

      {/* Secondary atmospheric layer */}
      <motion.div
        key={`atmo-${world.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 50%, ${colors.secondary}, transparent 60%)`,
        }}
      />

      {/* Accent lighting */}
      <motion.div
        key={`accent-${world.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.5 }}
        className="absolute inset-0"
        style={{
          background: atmosphere.lighting === 'warm'
            ? `linear-gradient(to top, ${colors.accent}, transparent 50%)`
            : `linear-gradient(135deg, ${colors.accent}, transparent 70%)`,
        }}
      />

      {/* Animated atmospheric effects */}
      <motion.div
        key={`glow-1-${world.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: atmosphere.lighting === 'bright' ? [0.3, 0.6, 0.3] : [0.15, 0.35, 0.15],
          scale: atmosphere.motion === 'pulsing' ? [1, 1.4, 1] : [1, 1.15, 1],
          x: atmosphere.motion === 'flowing' ? [0, 120, 0] : 0,
          y: atmosphere.motion === 'flowing' ? [0, -60, 0] : 0,
        }}
        transition={{
          duration: atmosphere.motion === 'turbulent' ? 4 : 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl"
        style={{
          backgroundColor: colors.glow,
          opacity: 0.3,
        }}
      />

      <motion.div
        key={`glow-2-${world.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.45, 0.2],
          scale: atmosphere.motion === 'pulsing' ? [1.3, 0.9, 1.3] : [1.15, 0.95, 1.15],
          x: atmosphere.motion === 'flowing' ? [0, -90, 0] : 0,
          y: atmosphere.motion === 'flowing' ? [0, 70, 0] : 0,
        }}
        transition={{
          duration: atmosphere.motion === 'turbulent' ? 5 : 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/3 right-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl"
        style={{
          backgroundColor: colors.secondary,
          opacity: 0.25,
        }}
      />

      {/* Category-specific effects */}
      {category === 'rain' && (
        <motion.div
          key="rain-overlay"
          animate={{
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-slate-900/30"
        />
      )}

      {category === 'fire' && (
        <>
          <motion.div
            key="fire-glow"
            className="absolute bottom-0 left-0 right-0 h-1/2 blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            style={{
              background: `radial-gradient(ellipse at bottom, ${colors.accent}, transparent 70%)`,
            }}
          />
        </>
      )}

      {category === 'night' && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {category === 'light' && (
        <motion.div
          key="light-rays"
          className="absolute inset-0"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          style={{
            background: `conic-gradient(from 45deg at 50% 30%, transparent 0deg, ${colors.glow} 60deg, transparent 120deg, ${colors.glow} 240deg, transparent 300deg)`,
          }}
        />
      )}

      {atmosphere.motion === 'gentle' && category === 'forest' && (
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor: colors.accent,
                borderWidth: '1px',
                opacity: 0.1,
              }}
              animate={{
                width: ['0px', '1000px'],
                height: ['0px', '1000px'],
                opacity: [0.15, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                delay: i * 4,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette effect for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
