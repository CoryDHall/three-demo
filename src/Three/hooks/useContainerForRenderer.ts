import { useEffect } from "react";

export function useContainerForRenderer(renderer: THREE.Renderer, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (containerRef.current === null) return;
    containerRef.current.appendChild(renderer.domElement);
  }, [renderer, containerRef])
}
