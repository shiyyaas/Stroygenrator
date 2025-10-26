import { KeyboardShortcuts } from './KeyboardShortcuts';
import { IntroPrompt } from './IntroPrompt';

export function IntroInstructions() {
  return (
    <div className="space-y-3">
      <KeyboardShortcuts />
      <IntroPrompt />
    </div>
  );
}
