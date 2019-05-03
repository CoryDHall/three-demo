import { useEffect, useState } from "react";
import { Utils } from "../../utils";

type MouseEffect = (x?: number, y?: number) => void;
export function useMousemove(effect: MouseEffect) {
  const [{ clientX, clientY }, setPosition] = useState({ clientX: 0, clientY: 0 });

  useEffect(() => {
    function reportMousemove(e: MouseEvent) {
      setPosition(e);
    }
    window.addEventListener('mousemove', reportMousemove);
    return () => window.removeEventListener('mousemove', reportMousemove)
  });

  useEffect(Utils.throttle(() => effect(clientX, clientY)), [effect, clientX, clientY])

  return [clientX, clientY]
}
