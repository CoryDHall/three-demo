import { COLORS } from "../constants";
import * as THREE from "three";
type ColorIdent = keyof typeof COLORS | number | THREE.Color
export function makePoint(color: ColorIdent, lightArgs: number[], positionArray?: number[]) {
  const light = new THREE.PointLight(_resolveColor(color), ...lightArgs);

  positionArray && light.position.fromArray(positionArray)
  return light;
}

export function makeAmbient(color: ColorIdent, intensity: number = .5) {
  return new THREE.AmbientLight(_resolveColor(color), intensity)
}

function _resolveColor(ident: ColorIdent) {
  switch (typeof ident) {
    // ts-ignore
    case 'undefined': return;
    case 'number': return ident;
    case 'string':
      if (typeof COLORS[ident] === 'number') {
        return COLORS[ident]
      }
    default: return;
  }
}

export const make = {
  Point: makePoint,
  Ambient: makeAmbient,
}
