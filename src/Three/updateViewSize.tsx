import * as THREE from "three";

export function updateViewSize(renderer: THREE.Renderer, camera: THREE.Camera) {
  const {
    width,
    height
  } = (renderer.domElement.parentElement || renderer.domElement).getBoundingClientRect();

  renderer.setSize(width, height);

  if (camera instanceof THREE.PerspectiveCamera) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}
