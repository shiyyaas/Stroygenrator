import { X } from 'lucide-react';

interface ExitButtonProps {
  onClick: () => void;
}

export function ExitButton({ onClick }: ExitButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-8 right-8 z-50 bg-white/80 hover:bg-white/90 backdrop-blur-xl border border-white/50 rounded-full p-3 shadow-xl transition-all"
    >
      <X size={20} className="text-slate-700" />
    </button>
  );
}
