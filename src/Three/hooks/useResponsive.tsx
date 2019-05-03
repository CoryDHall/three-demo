import { useEffect, useState } from "react";

export function useResponsive(ref: React.RefObject<HTMLDivElement>) {
  const [{ width, height }, setDimensions] = useState(() => {
    if (ref.current) return ref.current.getBoundingClientRect();
    return { width: -1, height: -1 }
  });

  useEffect(() => {
    function resize() {
      ref.current && setDimensions(ref.current.getBoundingClientRect());
    }
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize)
  }, [ref]);

  return [width, height]
}
