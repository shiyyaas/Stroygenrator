import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-8 left-8 z-50 bg-white/90 hover:bg-white backdrop-blur-xl border-2 border-white/60 rounded-[40px] px-5 py-3 shadow-xl transition-all flex items-center gap-3 hover:scale-105 active:scale-95 font-[Abhaya_Libre_ExtraBold] bg-[rgba(255,255,245,0.9)]"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <ArrowLeft size={18} className="text-white" />
      </div>
      <span className="text-slate-800">Back to Multiverse</span>
    </button>
  );
}
