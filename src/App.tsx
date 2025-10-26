import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppLayout } from './components/AppLayout';
import { IntroScreen } from './components/IntroScreen';
import { TypingBuffer } from './components/TypingBuffer';
import { ModeIndicator } from './components/ModeIndicator';
import { WorldLimitWarning } from './components/WorldLimitWarning';
import { CartoonMultiverse } from './components/CartoonMultiverse';
import { CartoonWorldView } from './components/CartoonWorldView';
import { TypingSound } from './components/TypingSound';
import { EmojiReference } from './components/EmojiReference';
import { AISettings } from './components/settings/AISettings';
import { useTypingInput } from './hooks/useTypingInput';
import { useWorldManagement } from './hooks/useWorldManagement';

const MAX_WORLDS = 10;
const MIN_WORD_LENGTH = 3;

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  // World management hook
  const {
    worlds,
    activeWorldId,
    currentWorld,
    processWord,
    enterWorld,
    exitWorld,
  } = useWorldManagement({ maxWorlds: MAX_WORLDS });

  // Typing input hook
  const { typedWord, isTyping } = useTypingInput({
    minWordLength: MIN_WORD_LENGTH,
    onCommitWord: processWord,
    onDismissIntro: () => setShowIntro(false),
    onEscape: exitWorld,
    showIntro,
    activeWorldId,
  });

  return (
    <AppLayout>
      {/* Typing Sound */}
      <TypingSound isTyping={isTyping} />

      {/* Emoji Reference */}
      {!showIntro && !activeWorldId && (
        <EmojiReference />
      )}

      {/* AI Settings */}
      {!showIntro && <AISettings />}

      {/* Intro screen */}
      <AnimatePresence>
        {showIntro && <IntroScreen />}
      </AnimatePresence>

      {/* Main view */}
      <AnimatePresence mode="wait">
        {activeWorldId && currentWorld ? (
          <CartoonWorldView
            key={`world-${activeWorldId}`}
            world={currentWorld}
            onExit={exitWorld}
          />
        ) : (
          <CartoonMultiverse
            key="multiverse"
            worlds={worlds}
            onWorldClick={enterWorld}
            activeWorldId={activeWorldId}
          />
        )}
      </AnimatePresence>

      {/* Typing buffer HUD - only show in multiverse view */}
      {!activeWorldId && (
        <TypingBuffer typedWord={typedWord} minWordLength={MIN_WORD_LENGTH} />
      )}

      {/* World limit warning */}
      {worlds.length >= MAX_WORLDS && !activeWorldId && (
        <WorldLimitWarning />
      )}
    </AppLayout>
  );
}
