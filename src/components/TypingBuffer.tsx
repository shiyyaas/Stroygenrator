import { TypingBufferContainer } from './typing/TypingBufferContainer';
import { TypedWordDisplay } from './typing/TypedWordDisplay';
import { CharacterCounter } from './typing/CharacterCounter';
import { CreatePrompt } from './typing/CreatePrompt';

interface TypingBufferProps {
  typedWord: string;
  minWordLength: number;
}

export function TypingBuffer({ typedWord, minWordLength }: TypingBufferProps) {
  const remainingChars = minWordLength - typedWord.length;
  const isReady = typedWord.length >= minWordLength;
  const isTyping = typedWord.length > 0 && typedWord.length < minWordLength;

  return (
    <TypingBufferContainer>
      <TypedWordDisplay word={typedWord} />
      {isTyping && <CharacterCounter remaining={remainingChars} />}
      {isReady && <CreatePrompt />}
    </TypingBufferContainer>
  );
}
