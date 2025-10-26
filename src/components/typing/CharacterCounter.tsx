interface CharacterCounterProps {
  remaining: number;
}

export function CharacterCounter({ remaining }: CharacterCounterProps) {
  return (
    <div className="text-slate-500 text-xs text-center mt-2">
      {remaining} more
    </div>
  );
}
