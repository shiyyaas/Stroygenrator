interface MetadataBadgeProps {
  text: string;
}

export function MetadataBadge({ text }: MetadataBadgeProps) {
  return (
    <span className="px-3 py-1.5 bg-slate-100/80 text-slate-600 rounded-full">
      {text}
    </span>
  );
}
