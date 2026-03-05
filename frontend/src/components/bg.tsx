const STARS = Array.from({ length: 140 }, (_, i) => {
  const seed = i * 2654435761;
  const x = ((seed ^ (seed >> 16)) % 10000) / 100;
  const y = ((seed * 1234567) % 10000) / 100;
  const size = (((seed * 987654) % 3) + 1);
  const op = ((seed * 111113) % 40 + 15) / 100;
  return { x: Math.abs(x), y: Math.abs(y), size, op };
});

export default function StarsBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${s.y}%`,
          left: `${s.x}%`,
          width: s.size,
          height: s.size,
          borderRadius: "50%",
          background: "white",
          opacity: s.op,
        }} />
      ))}
    </div>
  );
}