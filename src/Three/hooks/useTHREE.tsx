import { PerspectiveCameraArgs } from "../builders";
import { useCamera, useScene, useRenderer } from ".";

type ThreeUpdaterFunction = (renderer: THREE.Renderer, camera: THREE.Camera, scene: THREE.Scene) => void;
type ThreeUpdater = (callback: ThreeUpdaterFunction) => void
export function useTHREE(rendererOptions?: THREE.WebGLRendererParameters, cameraOptions?: PerspectiveCameraArgs): [THREE.Renderer, THREE.Camera, THREE.Scene, ThreeUpdater] {
  const [renderer] = useRenderer(rendererOptions);
  const [camera] = useCamera(cameraOptions);
  const [scene] = useScene();

  function threeUpdater(callback: ThreeUpdaterFunction) {
    callback(renderer, camera, scene)
  }

  return [renderer, camera, scene, threeUpdater];
}
