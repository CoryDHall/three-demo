import { useState } from "react";
import { buildRenderer } from "../builders";

export function useRenderer(options?: THREE.WebGLRendererParameters): StateHook<THREE.Renderer> {
  const [renderer] = useState<THREE.Renderer>(() => buildRenderer(options));

  return [renderer, function updateRenderer(rendererTransform) {
    rendererTransform(renderer)
  }]
}
