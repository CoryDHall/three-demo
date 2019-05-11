import * as THREE from 'three';
import { COLORS } from '../constants';
import { NoiseTexture } from '.';

export const makePearlMetal = (flatShading: boolean = false, grill: boolean = true) => {
  return new THREE.MeshPhysicalMaterial({
    color: COLORS.WHITE,
    ...grill ? {
      alphaMap: NoiseTexture.fromDimensions(1023, 1, 'RGBAAlternate'),
      alphaTest: .5,
    } : {},
    metalness: 100,
    fog: true,
    bumpMap: NoiseTexture.fromDimensions(2048, 512),
    bumpScale: .008,
    clearCoat: 1,
    clearCoatRoughness: 0.095,
    flatShading,
    side: THREE.DoubleSide,
  });
}

export const makeHair = () => {
  const texture = NoiseTexture.fromDimensions(1, 2 << 8);
  return new THREE.MeshPhysicalMaterial({
    transparent: true,
    opacity: .92,
    alphaTest: .8,
    alphaMap: texture,
    // color: COLORS.BLACK,
    roughness: 0.2,
    metalness: 100,
    fog: true,
    metalnessMap: texture,
    displacementMap: NoiseTexture.fromDimensions(8 << 6),
    depthWrite: false,
    clearCoat: 1,
    clearCoatRoughness: 0,
    side: THREE.DoubleSide,
    // flatShading: true,
  });
}

export const make = {
  Hair: () => makeHair(),
  PearlMetal: () => makePearlMetal(false, false),
  PearlMetalFlat: () => makePearlMetal(true, false),
  PearlMetalGrill: () => makePearlMetal(),
  PearlMetalGrillFlat: () => makePearlMetal(true),
}
