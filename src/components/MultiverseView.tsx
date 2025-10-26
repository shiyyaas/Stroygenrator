import { motion } from 'motion/react';
import { Portal } from './Portal';
import { WorldType } from './AudioEngine';

export interface PortalData {
  id: string;
  letters: string;
  world: WorldType;
  position: { x: number; y: number };
  timestamp: number;
}

interface MultiverseViewProps {
  portals: PortalData[];
  onPortalClick: (portalId: string) => void;
  activePortalId: string | null;
}

export function MultiverseView({ portals, onPortalClick, activePortalId }: MultiverseViewProps) {
  return (
    <div className="fixed inset-0 z-30">
      {/* Multiverse background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black"
      />

      {/* Animated starfield */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Portals */}
      <div className="relative w-full h-full">
        {portals.map((portal) => (
          <Portal
            key={portal.id}
            id={portal.id}
            letters={portal.letters}
            world={portal.world}
            position={portal.position}
            onClick={() => onPortalClick(portal.id)}
            isActive={portal.id === activePortalId}
          />
        ))}
      </div>

      {/* Instructions overlay */}
      {portals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
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
              The Multiverse Awaits
            </motion.div>
            <p className="text-white/40 max-w-md">
              Type three letters to spawn a portal. Click any portal to enter its world.
            </p>
          </div>
        </motion.div>
      )}

      {/* Portal count */}
      {portals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 text-white/50 uppercase tracking-widest"
        >
          {portals.length} {portals.length === 1 ? 'World' : 'Worlds'} Created
        </motion.div>
      )}
    </div>
  );
}
