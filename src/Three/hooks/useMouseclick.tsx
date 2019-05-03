import { useEffect, useState } from "react";

export function useMouseclick() {
  const [{ clientX, clientY }, setPosition] = useState({ clientX: 0, clientY: 0 });

  useEffect(() => {
    function reportMousemove(e: MouseEvent) {
      setPosition(e);
    }
    window.addEventListener('click', reportMousemove);
    return () => window.removeEventListener('click', reportMousemove)
  });

  return [clientX, clientY]
}
