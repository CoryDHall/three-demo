import { buildScene } from "../builders";

import { useState } from "react";

export function useScene(): StateHook<THREE.Scene> {
  const [scene] = useState<THREE.Scene>(buildScene);

  return [scene, function updateScene(sceneTransform) {
    sceneTransform(scene)
  }]
}
