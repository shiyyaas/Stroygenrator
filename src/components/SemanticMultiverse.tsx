import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { SemanticPortal } from './SemanticPortal';
import { SemanticWorld } from '../utils/SemanticWorldGenerator';

interface SemanticMultiverseProps {
  worlds: SemanticWorld[];
  onWorldClick: (worldId: string) => void;
  activeWorldId: string | null;
}

export function SemanticMultiverse({ worlds, onWorldClick, activeWorldId }: SemanticMultiverseProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag with left mouse button
    if (e.button === 0) {
      setIsDragging(true);
      setHasDragged(false);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      
      // Check if we've moved more than a few pixels (threshold for dragging vs clicking)
      const dragDistance = Math.sqrt(
        Math.pow(newX - pan.x, 2) + Math.pow(newY - pan.y, 2)
      );
      
      if (dragDistance > 5) {
        setHasDragged(true);
      }
      
      setPan({ x: newX, y: newY });
    }
  }, [isDragging, pan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Reset hasDragged after a short delay
    setTimeout(() => setHasDragged(false), 50);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-30 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging && hasDragged ? 'grabbing' : 'grab' }}
    >
      {/* Multiverse background - cinematic */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-black"
      />

      {/* Animated starfield */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.9 ? '2px' : '1px',
              height: Math.random() > 0.9 ? '2px' : '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.9, 0.1],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Nebula effect */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[50rem] h-[50rem] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #4c1d95, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
      />

      {/* Grid lines - subtle */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: `${pan.x % 100}px ${pan.y % 100}px`,
        }}
      />

      {/* Portals container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          x: pan.x,
          y: pan.y,
        }}
      >
        {worlds.map((world, index) => {
          // Golden spiral positioning
          const angle = index * 0.618 * Math.PI * 2;
          const radius = 180 + index * 110;
          const position = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          };

          return (
            <SemanticPortal
              key={world.id}
              world={world}
              position={position}
              onClick={() => {
                // Only trigger click if we didn't drag
                if (!hasDragged) {
                  onWorldClick(world.id);
                }
              }}
              isActive={world.id === activeWorldId}
            />
          );
        })}
      </motion.div>

      {/* Welcome message */}
      {worlds.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center max-w-2xl px-8">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="text-white/80 mb-6"
            >
              The Ultimate Creation Area
            </motion.div>
            <p className="text-white/50 mb-4 leading-relaxed">
              Type meaningful words to create worlds. Each word becomes reality — "tree" spawns forests, "fire" ignites realms, "dragon" summons legendary domains.
            </p>
            <p className="text-white/40 text-sm">
              Drag to explore • Click portals to enter • Type to evolve
            </p>
          </div>
        </motion.div>
      )}

      {/* World count */}
      {worlds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 pointer-events-none"
        >
          <div className="text-white/50 uppercase tracking-widest mb-2">
            {worlds.length} / 10 Worlds Created
          </div>
          <div className="flex flex-wrap gap-2 max-w-xs">
            {worlds.slice(-5).map((world, i) => (
              <div
                key={i}
                className="text-xs text-white/40 px-2 py-1 bg-white/5 rounded border border-white/10"
              >
                {world.word}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Drag hint */}
      {worlds.length > 3 && !isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 uppercase tracking-wider text-sm pointer-events-none"
        >
          Click and drag to navigate the multiverse
        </motion.div>
      )}
    </div>
  );
}
