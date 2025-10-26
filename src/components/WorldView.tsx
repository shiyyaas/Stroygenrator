import { motion } from 'motion/react';
import { World } from './World';
import { ParticleSystem } from './ParticleSystem';
import { WorldType } from './AudioEngine';
import { X } from 'lucide-react';

interface WorldViewProps {
  world: WorldType;
  letters: string;
  onExit: () => void;
}

export function WorldView({ world, letters, onExit }: WorldViewProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      className="fixed inset-0 z-40"
    >
      {/* World background */}
      <World world={world} />

      {/* Particle system */}
      <ParticleSystem world={world} />

      {/* World info overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* World name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-12 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-white/90 uppercase tracking-[0.5em] mb-2">
            {letters}
          </div>
          <div className="text-white/50 uppercase tracking-widest">
            World: {world}
          </div>
        </motion.div>

        {/* Exit button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onExit}
          className="absolute top-8 right-8 pointer-events-auto group"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors" />
            
            {/* Button */}
            <div className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/40 transition-all">
              <X className="w-5 h-5 text-white/70 group-hover:text-white/90" />
            </div>
          </div>
        </motion.button>

        {/* Typing hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-white/40 uppercase tracking-wider">
            Keep typing to evolve this world
          </p>
          <p className="text-white/30 uppercase tracking-wider mt-2">
            Press ESC or click × to exit
          </p>
        </motion.div>

        {/* Immersive frame effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Vignette */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-white/10" />
          <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-white/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-white/10" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-white/10" />
        </motion.div>
      </div>
    </motion.div>
  );
}
