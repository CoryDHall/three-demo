type VectorTransform = (arg0: Float32List, arg1: number) => void
function _3dVectorIterator(cb: VectorTransform, numPoints: number) {
  const offset = 3 * numPoints;
  return (arr: Float32List, start = 0, end = arr.length - 2) => {
    if (numPoints === 0) return;

    if (offset < 0) {
      for (let i = end - 1; i >= start; i += offset) {
        cb(arr, i);
      }

    } else {
      for (let i = start; i < end; i += offset) {
        cb(arr, i);
      }
    }
  }
}
enum V {
  X = 0b001,
  Y = 0b010,
  Z = 0b100
}
type _hasVectorComponentFunction = (flags: number) => boolean | number
const hasX: _hasVectorComponentFunction = v => v & V.X
const hasY: _hasVectorComponentFunction = v => v & V.Y
const hasZ: _hasVectorComponentFunction = v => v & V.Z
type GeometryTransformBase = (vectorFlag: VariantKey, param1: any, numPoints?: number) => GeometryIteratorFunction
type GeometryTransformFunction = (param1: any, numPoints?: number) => GeometryIteratorFunction
interface VectorComponentVariants {
  [key: string]: GeometryTransformFunction
}
const GEOMETRY_VARIANTS: Readonly<{ [k: string]: number }> = {
  X: 0b001,
  Y: 0b010,
  XY: 0b011,
  Z: 0b100,
  XZ: 0b101,
  YZ: 0b110,
  XYZ: 0b111,
}
type VariantKey = keyof typeof GEOMETRY_VARIANTS & number;
function _makeVectorComponentVariants(fn: GeometryTransformBase): VectorComponentVariants {
  const { name } = fn;
  const variants: VectorComponentVariants = { [name]: fn };

  for (let key in GEOMETRY_VARIANTS) {
    variants[`${name}${key}`] = (param1, numPoints?) => fn(GEOMETRY_VARIANTS[key], param1, numPoints)
  }

  return variants;
}
type GeometryIteratorFunction = (geometry: THREE.BufferGeometry) => void
function _genGeometryIterator(fn: (arg0: Float32Array) => void): GeometryIteratorFunction {
  return function(geometry) {
    const arr = geometry.getAttribute('position').array as Float32Array;
    fn(arr)
  }
}
type VectorTransformSequence = VectorTransform[]
function sinh(variant: VariantKey, scale: number, numPoints: number = 2): GeometryIteratorFunction {
  const { sinh } = Math; // bypass object lookup

  const vectorTransforms: VectorTransformSequence = [];
  if (hasX(variant)) vectorTransforms.push((a, i) => {
    a[i] = sinh(a[i] / scale) * scale
  })
  if (hasY(variant)) vectorTransforms.push((a, i) => {
    a[i + 1] = sinh(a[i + 1] / scale) * scale
  })
  if (hasZ(variant)) vectorTransforms.push((a, i) => {
    a[i + 2] = sinh(a[i + 2])
  })

  return _genGeometryIterator(
    _3dVectorIterator(
      (arr, i) => vectorTransforms.forEach(fn => fn(arr, i)),
      numPoints
    )
  );
}

const bitwise: GeometryTransformBase = (variant, smoothingScale, numPoints = 1) => {
  const fn = (arr: Float32List, i: number) => {
    if (!smoothingScale) return;
    arr[i] = ((arr[i] * smoothingScale) << 0) / smoothingScale;
  }

  return _genGeometryIterator(_3dVectorIterator((arr, i) => {
    if (hasX(variant)) fn(arr, i)
    if (hasY(variant)) fn(arr, i + 1)
    if (hasZ(variant)) fn(arr, i + 2)
  }, numPoints))
}

function bitwiseZ(smoothingScale: number, numPoints: number = 1) {
  let trueScale = smoothingScale === 0 ? 1 : smoothingScale;
  return _genGeometryIterator(_3dVectorIterator((arr, i) => {
    arr[i + 2] = ((arr[i + 2] * trueScale) << 0) / trueScale;
  }, numPoints))
}

function bitwiseXY(smoothingScale: number, numPoints: number = 1) {
  let trueScale = smoothingScale === 0 ? 1 : smoothingScale;
  return _genGeometryIterator(_3dVectorIterator((arr, i) => {
    arr[i] = ((arr[i] * trueScale) << 0) / trueScale;
    arr[i + 1] = ((arr[i + 1] * trueScale) << 0) / trueScale;
  }, numPoints))
}

export const make: { [key: string]: GeometryTransformFunction } = {
  ..._makeVectorComponentVariants(sinh),
  ..._makeVectorComponentVariants(bitwise),
}
