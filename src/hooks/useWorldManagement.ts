import { useState, useCallback } from 'react';
import { generateCartoonWorld, evolveCartoonWorld, CartoonWorld } from '../utils/CartoonWorldGenerator';

interface UseWorldManagementProps {
  maxWorlds: number;
}

export function useWorldManagement({ maxWorlds }: UseWorldManagementProps) {
  const [worlds, setWorlds] = useState<CartoonWorld[]>([]);
  const [activeWorldId, setActiveWorldId] = useState<string | null>(null);

  // Get current world
  const currentWorld = activeWorldId 
    ? worlds.find(w => w.id === activeWorldId) || null
    : null;

  // Create or evolve world based on word
  const processWord = useCallback((word: string) => {
    if (activeWorldId) {
      // Evolve the active world
      setWorlds(prevWorlds => 
        prevWorlds.map(w => 
          w.id === activeWorldId 
            ? evolveCartoonWorld(w, word)
            : w
        )
      );
    } else {
      // Create a new world in multiverse
      const worldId = `world-${Date.now()}-${Math.random()}`;
      const newWorld = generateCartoonWorld(word, worldId);
      
      setWorlds(prevWorlds => {
        // If at max capacity, remove oldest world
        if (prevWorlds.length >= maxWorlds) {
          return [...prevWorlds.slice(1), newWorld];
        }
        return [...prevWorlds, newWorld];
      });
    }
  }, [activeWorldId, maxWorlds]);

  // Enter a world
  const enterWorld = useCallback((worldId: string) => {
    setActiveWorldId(worldId);
  }, []);

  // Exit current world
  const exitWorld = useCallback(() => {
    setActiveWorldId(null);
  }, []);

  return {
    worlds,
    activeWorldId,
    currentWorld,
    processWord,
    enterWorld,
    exitWorld,
  };
}
