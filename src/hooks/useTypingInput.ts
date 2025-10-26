import { useState, useEffect, useCallback } from 'react';

interface UseTypingInputProps {
  minWordLength: number;
  onCommitWord: (word: string) => void;
  onDismissIntro?: () => void;
  onEscape?: () => void;
  showIntro?: boolean;
  activeWorldId?: string | null;
}

export function useTypingInput({
  minWordLength,
  onCommitWord,
  onDismissIntro,
  onEscape,
  showIntro = false,
  activeWorldId = null,
}: UseTypingInputProps) {
  const [typedWord, setTypedWord] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [wordCommitTimeout, setWordCommitTimeout] = useState<NodeJS.Timeout | null>(null);

  const commitWord = useCallback((word: string) => {
    if (word.length >= minWordLength) {
      onCommitWord(word);
      setTypedWord('');
    }
  }, [minWordLength, onCommitWord]);

  // Handle paste for emojis
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const pastedText = e.clipboardData?.getData('text') || '';
      
      if (pastedText) {
        setTypedWord(prev => {
          const newWord = prev + pastedText;
          
          // Clear existing timeout
          if (wordCommitTimeout) {
            clearTimeout(wordCommitTimeout);
          }
          
          // Auto-commit after 1.5 seconds
          const timeout = setTimeout(() => {
            commitWord(newWord);
          }, 1500);
          
          setWordCommitTimeout(timeout);
          
          return newWord;
        });
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [wordCommitTimeout, commitWord]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Dismiss intro on first keypress
      if (showIntro && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        onDismissIntro?.();
      }

      // Handle escape - exit world
      if (e.key === 'Escape') {
        if (activeWorldId) {
          onEscape?.();
          setTypedWord('');
        }
        return;
      }

      // Handle backspace
      if (e.key === 'Backspace') {
        setTypedWord(prev => prev.slice(0, -1));
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 50);
        
        // Clear auto-commit timeout
        if (wordCommitTimeout) {
          clearTimeout(wordCommitTimeout);
          setWordCommitTimeout(null);
        }
        return;
      }

      // Handle space or enter - commit word immediately
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        commitWord(typedWord);
        
        // Clear auto-commit timeout
        if (wordCommitTimeout) {
          clearTimeout(wordCommitTimeout);
          setWordCommitTimeout(null);
        }
        return;
      }

      // Process letter keys and emojis
      if (e.key.length === 1 || e.key.length > 1) {
        // Allow letters and emojis
        const isValidChar = /[a-zA-Z]/.test(e.key) || /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/u.test(e.key);
        
        if (isValidChar) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 50);

          setTypedWord(prev => {
            const newWord = prev + e.key;
            
            // Clear existing timeout
            if (wordCommitTimeout) {
              clearTimeout(wordCommitTimeout);
            }
            
            // Auto-commit after 1.5 seconds of no typing
            const timeout = setTimeout(() => {
              commitWord(newWord);
            }, 1500);
            
            setWordCommitTimeout(timeout);
            
            return newWord;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (wordCommitTimeout) {
        clearTimeout(wordCommitTimeout);
      }
    };
  }, [showIntro, activeWorldId, typedWord, commitWord, wordCommitTimeout, onDismissIntro, onEscape]);

  return {
    typedWord,
    isTyping,
    setTypedWord,
  };
}
