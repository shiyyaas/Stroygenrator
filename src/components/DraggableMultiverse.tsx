import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { GenerativePortal } from './GenerativePortal';
import { GeneratedWorld } from '../utils/WorldGenerator';

interface DraggableMultiverseProps {
  worlds: GeneratedWorld[];
  onWorldClick: (worldId: string) => void;
  activeWorldId: string | null;
}

export function DraggableMultiverse({ worlds, onWorldClick, activeWorldId }: DraggableMultiverseProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag with left mouse button and not on portals
    if (e.button === 0 && (e.target as HTMLElement).closest('.portal-container') === null) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-30 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Multiverse background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black"
      />

      {/* Animated starfield */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid lines - moves with pan */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: `${pan.x % 100}px ${pan.y % 100}px`,
        }}
      />

      {/* Portals container - moves with pan */}
      <motion.div
        className="relative w-full h-full portal-container"
        style={{
          x: pan.x,
          y: pan.y,
        }}
      >
        {worlds.map((world, index) => {
          // Spiral positioning
          const angle = index * 0.618 * Math.PI * 2;
          const radius = 150 + index * 100;
          const position = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          };

          return (
            <GenerativePortal
              key={world.id}
              world={world}
              position={position}
              onClick={() => onWorldClick(world.id)}
              isActive={world.id === activeWorldId}
            />
          );
        })}
      </motion.div>

      {/* Instructions overlay */}
      {worlds.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="text-white/70 mb-4"
            >
              The Ultimate Creation Area
            </motion.div>
            <p className="text-white/40 max-w-md px-4">
              Type three letters to spawn a world. Drag to explore the multiverse. Click portals to enter.
            </p>
          </div>
        </motion.div>
      )}

      {/* World count */}
      {worlds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 text-white/50 uppercase tracking-widest pointer-events-none"
        >
          {worlds.length} / 10 Worlds
        </motion.div>
      )}

      {/* Drag hint */}
      {worlds.length > 3 && !isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 uppercase tracking-wider pointer-events-none"
        >
          Drag to explore
        </motion.div>
      )}
    </div>
  );
}
