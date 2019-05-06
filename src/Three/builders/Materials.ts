import * as THREE from 'three';
import { COLORS } from '../constants';
import { NoiseTexture } from '.';

export const makePearlMetal = (flatShading: boolean = false) => {
  return new THREE.MeshPhysicalMaterial({
    color: COLORS.WHITE,
    alphaMap: NoiseTexture.fromDimensions(1023, 1, 'RGBAAlternate'),
    alphaTest: .5,
    metalness: 100,
    fog: true,
    bumpMap: NoiseTexture.fromDimensions(2048, 512),
    bumpScale: .008,
    displacementScale: 0.25,
    displacementBias: .1,
    clearCoat: 1,
    clearCoatRoughness: 0.095,
    flatShading,
    side: THREE.DoubleSide,
  });
}

export const make = {
  PearlMetal: () => makePearlMetal(),
  PearlMetalFlat: () => makePearlMetal(true),
}
