import * as THREE from "three";

type TextureFillFunction = (_v: number, index: number) => number;
type TextureFillGenerator = (...args: any) => TextureFillFunction
const isA = (i: number) => (i - 3 % 4)
const FILL_GENERATORS = {
  RGBANoise: () => (_v: any, i: number) => {
    return (isA(i) ? (1 - Math.random()) : 1) * 255
  },
  RGBAAlternate: (w: number, h: number = w) => {
    const m = 4 << -~Math.log2(w * h);

    return (_v: any, i: number) => {
      return isA(i) ? (((~~(i / m)) + (i >> 2)) % 2) * 255 : 255;
    };
  }
}

type TextureKeyOrGenerator = keyof typeof FILL_GENERATORS | TextureFillGenerator

function rgba(w: number, h: number): Uint8Array {
  const m = -~Math.log2(w * h);
  return new Uint8Array(4 << m);
}

function _gen(fillFnGenerator: TextureKeyOrGenerator) {
  return typeof fillFnGenerator === 'string' ?
    FILL_GENERATORS[fillFnGenerator] :
    fillFnGenerator
}

// ts-ignore
export const NoiseTexture = {
  FILL_GENERATORS,
  /**
   * Make Random Texture
   */
  fromDimensions: function fromDimensions(
    width: number,
    height = width,
    fillKeyOrGenerator: TextureKeyOrGenerator = FILL_GENERATORS.RGBANoise
  ): THREE.Texture {
    const mapFn: TextureFillGenerator = _gen(fillKeyOrGenerator)
    const fill = rgba(width, height).map(mapFn(width, height));
    const texture = new THREE.DataTexture(fill, width, height, THREE.RGBAFormat);

    texture.needsUpdate = true;
    if (!(Math.log2(width * height) % 1)) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    }

    return texture;
  }
}
