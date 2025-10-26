interface KeyboardShortcutProps {
  icon: string;
  label: string;
}

export function KeyboardShortcut({ icon, label }: KeyboardShortcutProps) {
  return (
    <span className="flex items-center gap-2">
      <kbd className="px-2 py-1 bg-white/60 backdrop-blur-sm border border-white rounded-lg text-xs shadow-sm">
        {icon}
      </kbd>
      {label}
    </span>
  );
}
