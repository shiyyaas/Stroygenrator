interface EvolutionHintProps {
  message?: string;
}

export function EvolutionHint({ message = "Type to evolve this world" }: EvolutionHintProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border-2 border-white/60 rounded-full px-8 py-3 text-slate-700 shadow-xl pointer-events-none">
      <span className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
        <span className="text-sm">{message}</span>
        <span className="text-lg">⌨️</span>
      </span>
    </div>
  );
}
