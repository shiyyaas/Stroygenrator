export function WorldLimitWarning() {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-amber-50/90 backdrop-blur-xl border border-amber-200/50 rounded-2xl px-5 py-3 text-amber-800 text-sm shadow-xl flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-600">
          <path d="M8 1L15 14H1L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M8 6V9M8 11.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Maximum worlds reached
      </div>
    </div>
  );
}
