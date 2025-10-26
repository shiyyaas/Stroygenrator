import { motion, AnimatePresence } from 'motion/react';
import { GenerativeWorld } from './GenerativeWorld';
import { GenerativeParticleSystem } from './GenerativeParticleSystem';
import { GeneratedWorld } from '../utils/WorldGenerator';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GenerativeWorldViewProps {
  world: GeneratedWorld;
  onExit: () => void;
}

export function GenerativeWorldView({ world, onExit }: GenerativeWorldViewProps) {
  const [showStory, setShowStory] = useState(true);

  // Hide story after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStory(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [world.id]);

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
      <GenerativeWorld world={world} />

      {/* Particle system */}
      <GenerativeParticleSystem world={world} />

      {/* World info overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Story introduction */}
        <AnimatePresence>
          {showStory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl text-center px-8"
              onClick={() => setShowStory(false)}
            >
              <motion.div
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="text-white/90 mb-6 tracking-[0.3em] uppercase"
                style={{ color: world.colors.accent }}
              >
                {world.seed}
              </motion.div>
              
              <p className="text-white/80 leading-relaxed mb-8">
                {world.story}
              </p>

              <motion.div
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-white/40 uppercase tracking-wider"
              >
                Click anywhere or wait to begin
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* World name - appears after story */}
        {!showStory && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 text-center"
          >
            <div 
              className="text-white/90 uppercase tracking-[0.5em] mb-2"
              style={{ color: world.colors.accent }}
            >
              {world.seed}
            </div>
            <div className="text-white/50 uppercase tracking-widest text-sm">
              {world.atmosphere.mood} • {world.atmosphere.motion}
            </div>
          </motion.div>
        )}

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
            <div 
              className="absolute inset-0 rounded-full blur-xl group-hover:opacity-50 transition-opacity opacity-30"
              style={{ backgroundColor: world.colors.glow }}
            />
            
            {/* Button */}
            <div className="relative w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/40 transition-all">
              <X className="w-5 h-5 text-white/70 group-hover:text-white/90" />
            </div>
          </div>
        </motion.button>

        {/* Typing hint */}
        {!showStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-white/50 uppercase tracking-wider">
              Type to evolve this world
            </p>
            <p className="text-white/30 uppercase tracking-wider mt-2 text-sm">
              Each 3 letters reshape reality • ESC or × to exit
            </p>
          </motion.div>
        )}

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
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
            }}
          />

          {/* Corner accents */}
          <div 
            className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2"
            style={{ borderColor: world.colors.accent, opacity: 0.2 }}
          />
          <div 
            className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2"
            style={{ borderColor: world.colors.accent, opacity: 0.2 }}
          />
          <div 
            className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2"
            style={{ borderColor: world.colors.accent, opacity: 0.2 }}
          />
          <div 
            className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2"
            style={{ borderColor: world.colors.accent, opacity: 0.2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
