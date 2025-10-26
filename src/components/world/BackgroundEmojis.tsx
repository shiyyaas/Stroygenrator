interface BackgroundEmojisProps {
  emojis: string[];
}

export function BackgroundEmojis({ emojis }: BackgroundEmojisProps) {
  // Show more background emojis for a more playful effect
  const backgroundEmojis = emojis.slice(0, 6);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {backgroundEmojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute opacity-[0.08]"
          style={{
            fontSize: `${120 + (i * 20)}px`,
            left: `${10 + (i % 3) * 30}%`,
            top: `${15 + Math.floor(i / 3) * 40}%`,
            transform: `rotate(${-15 + (i * 10)}deg)`,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}
