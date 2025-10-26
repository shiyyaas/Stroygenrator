import { KeyboardShortcut } from './KeyboardShortcut';

export function KeyboardShortcuts() {
  return (
    <div className="flex items-center justify-center gap-4 text-slate-500 text-sm flex-wrap">
      <KeyboardShortcut icon="⌨️" label="Type" />
      <KeyboardShortcut icon="📋" label="Paste" />
      <KeyboardShortcut icon="Space" label="Create" />
      <KeyboardShortcut icon="Click" label="Enter" />
    </div>
  );
}
