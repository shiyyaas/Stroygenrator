interface StoryContentProps {
  story: string;
}

export function StoryContent({ story }: StoryContentProps) {
  return (
    <div className="mb-6">
      {/* Story label */}
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 bg-slate-100/80 rounded-full text-xs text-slate-500">
          📖 Your Story
        </span>
      </div>
      
      {/* Main story content - clean and readable */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-white/50">
        <p className="text-slate-800 leading-relaxed text-lg text-center">
          {story}
        </p>
      </div>
    </div>
  );
}
