import { useEffect, useState } from "react";

const symbols = ["❌", "⭕", "⬜", "△"];

export default function BackgroundParticles() {
  const [items, setItems] = useState([]);

  useEffect(() => {

    const generated = Array.from({ length: 25 }).map(() => ({
      id: crypto.randomUUID(),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 32 + 16,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 10,
      opacity: Math.random() * 0.5 + 0.1
    }));

    setItems(generated);

  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {items.map((item) => (
        <div
          key={item.id}
          className="floating absolute"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            opacity: item.opacity
          }}
        >
          {item.symbol}
        </div>
      ))}

    </div>
  );
}
