interface TypedWordDisplayProps {
  word: string;
}

export function TypedWordDisplay({ word }: TypedWordDisplayProps) {
  return (
    <div className="text-slate-900 tracking-[0.3em] min-w-[10rem] text-center">
      {word || '...'}
    </div>
  );
}
