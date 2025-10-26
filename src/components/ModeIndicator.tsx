interface ModeIndicatorProps {
  worldWord: string;
}

export function ModeIndicator({ worldWord }: ModeIndicatorProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-full px-6 py-2.5 text-slate-700 text-sm shadow-xl flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        Evolving <span className="text-slate-900">{worldWord}</span>
      </div>
    </div>
  );
}
