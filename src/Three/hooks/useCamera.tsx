import { useState } from "react";
import { buildCamera, PerspectiveCameraArgs } from "../builders";

export function useCamera(options?: PerspectiveCameraArgs): StateHook<THREE.Camera> {
  const [camera] = useState<THREE.Camera>(() => buildCamera(options));

  return [camera, function updateCamera(cameraTransform) {
    cameraTransform(camera)
  }]
}
