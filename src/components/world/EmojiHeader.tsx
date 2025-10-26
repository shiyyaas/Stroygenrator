interface EmojiHeaderProps {
  emojis: string[];
  primaryColor: string;
  accentColor: string;
}

export function EmojiHeader({ emojis, primaryColor, accentColor }: EmojiHeaderProps) {
  return (
    <div className="mb-8">
      {/* Playful header label */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 bg-white/60 rounded-full text-sm text-slate-600 shadow-sm">
          ✨ Your Creation ✨
        </span>
      </div>
      
      {/* All emojis displayed in order - cartoonish style */}
      <div className="flex gap-3 items-center justify-center flex-wrap">
        {emojis.map((emoji, i) => (
          <div
            key={i}
            className="relative group"
          >
            {/* Bouncy emoji container */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-6xl shadow-lg transform transition-transform hover:scale-110 hover:rotate-6"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}30, ${accentColor}30)`,
                border: `3px solid ${primaryColor}50`,
              }}
            >
              {emoji}
            </div>
            
            {/* Order number badge */}
            <div 
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md"
              style={{
                background: primaryColor,
                color: 'white',
              }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
