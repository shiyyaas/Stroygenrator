interface WorldTitleProps {
  word: string;
  theme: string;
}

export function WorldTitle({ word, theme }: WorldTitleProps) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-slate-900 mb-2">{word}</h2>
      <div className="text-slate-500">{theme}</div>
    </div>
  );
}
