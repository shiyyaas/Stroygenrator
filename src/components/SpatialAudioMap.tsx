import { motion } from 'motion/react';
import { CartoonWorld } from '../utils/CartoonWorldGenerator';

interface SpatialAudioMapProps {
  world: CartoonWorld | null;
  volume: number;
}

export function SpatialAudioMap({ world, volume }: SpatialAudioMapProps) {
  if (!world || volume === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 pointer-events-none"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-xl w-48">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs text-slate-600">Spatial Audio</span>
          </div>
          <span className="text-xs text-slate-400">{Math.round(volume * 100)}%</span>
        </div>

        {/* Visualizer Grid */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200">
          {/* Center point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-12 h-12 rounded-full"
              style={{
                background: `radial-gradient(circle, ${world.colors.primary}40, transparent)`,
              }}
            />
          </div>

          {/* Sound waves */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.3, 1.5],
                opacity: [0.5 * volume, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            >
              <div
                className="w-full h-full rounded-full border-2"
                style={{
                  borderColor: world.colors.primary,
                }}
              />
            </motion.div>
          ))}

          {/* Center emoji */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="text-2xl"
            >
              {world.creatures.emoji}
            </motion.div>
          </div>

          {/* Corner frequency indicators */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Sound info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">World</span>
            <span className="text-slate-700">{world.word}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Type</span>
            <span className="text-slate-700 capitalize">{world.sound.rhythm}</span>
          </div>
        </div>

        {/* Frequency bars */}
        <div className="mt-3 flex gap-1 h-8 items-end">
          {[...Array(12)].map((_, i) => {
            const height = Math.random() * 0.6 + 0.2;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  background: `linear-gradient(to top, ${world.colors.primary}, ${world.colors.accent})`,
                }}
                animate={{
                  height: `${height * volume * 100}%`,
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
