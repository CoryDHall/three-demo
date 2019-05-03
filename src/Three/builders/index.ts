import * as THREE from "three";
export * from './Texture';

export type PerspectiveCameraArgs = [number?, number?, number?, number?]
export function buildCamera(options?: PerspectiveCameraArgs) {
  return new THREE.PerspectiveCamera(...(options || []));
}
export function buildRenderer(options?: THREE.WebGLRendererParameters) {
  const args = { antialias: true, ...options };
  return new THREE.WebGLRenderer(args);
}

export function buildScene() {
  return new THREE.Scene();
}
