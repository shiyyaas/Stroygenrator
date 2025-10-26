import { motion } from 'motion/react';
import { CartoonWorld } from '../utils/CartoonWorldGenerator';
import { WorldBackground } from './world/WorldBackground';
import { BackgroundEmojis } from './world/BackgroundEmojis';
import { StoryPanel } from './world/StoryPanel';
import { BackButton } from './world/BackButton';
import { EvolutionHint } from './world/EvolutionHint';

interface CartoonWorldViewProps {
  world: CartoonWorld;
  onExit: () => void;
}

export function CartoonWorldView({ world, onExit }: CartoonWorldViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <WorldBackground 
        primaryColor={world.colors.primary} 
        backgroundColor={world.colors.background}
      >
        {/* Playful background emojis */}
        <BackgroundEmojis emojis={world.emojis} />
        
        {/* Main Story Panel with Emoji Header */}
        <StoryPanel
          emojis={world.emojis}
          primaryColor={world.colors.primary}
          accentColor={world.colors.accent}
          word={world.word}
          theme={world.theme}
          story={world.story}
          mood={world.atmosphere.mood}
          energy={world.atmosphere.energy}
        />

        {/* Navigation */}
        <BackButton onClick={onExit} />
        
        {/* Evolution hint */}
        <EvolutionHint />
      </WorldBackground>
    </motion.div>
  );
}
