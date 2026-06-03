export function SearchPulse() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {[0, 0.6, 1.2].map((d, i) => (
        <div
          key={i}
          className="absolute w-24 h-24 rounded-full border-2 border-violet sonar-ring"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
      <div className="relative w-20 h-20 rounded-full bg-violet/30 ring-2 ring-violet flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-violet shadow-[var(--shadow-glow-violet)]" />
      </div>
    </div>
  );
}
