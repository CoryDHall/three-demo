import { PerspectiveCameraArgs } from "../builders";
import { useCamera, useScene, useRenderer } from ".";
import { useEffect } from "react";
import * as THREE from "three";
import { COLORS } from "../constants";

type ThreeUpdaterFunction = (renderer: THREE.Renderer, camera: THREE.Camera, scene: THREE.Scene) => void;
type ThreeUpdater = (callback: ThreeUpdaterFunction) => void
export function useTHREE(rendererOptions?: THREE.WebGLRendererParameters, cameraOptions?: PerspectiveCameraArgs): [THREE.Renderer, THREE.Camera, THREE.Scene, ThreeUpdater] {
  const [renderer] = useRenderer(rendererOptions);
  const [camera] = useCamera(cameraOptions);
  const [scene] = useScene();

  function threeUpdater(callback: ThreeUpdaterFunction) {
    callback(renderer, camera, scene)
  }

  useEffect(() => {
    if (renderer === null) return;

    if (renderer instanceof THREE.WebGLRenderer) {
      renderer.shadowMap.enabled = true;
      // renderer.setClearColor(0x00ff00);
      renderer.setClearColor(COLORS.WHITE);
      // renderer.setClearAlpha(0.5)
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera)
      })

      return () => {
        // @ts-ignore
        renderer.setAnimationLoop(null)
      }
    }
  }, [renderer, camera, scene]);

  return [renderer, camera, scene, threeUpdater];
}
