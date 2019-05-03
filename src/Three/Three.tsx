import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { updateViewSize } from './updateViewSize';
import { useTHREE, useResponsive, useMousemove, useMouseclick } from './hooks';
import { Utils } from '../utils';
import { COLORS } from './constants';
import { ThreeContainer } from './ThreeContainer';
import { NoiseTexture } from './builders';

interface ThreeProps {
  shapeParams: {
    tubularSegmentsBase: number;
    tubularSegmentsExp: number;
    radialSegments: number;
    axisRotations: number;
    tubeRotations: number;
  }
}
function Three(props: ThreeProps) {
  const [
    renderer, camera, scene,
    updateThree
  ] = useTHREE();

  const container = React.createRef<HTMLDivElement>();
  const [material] = useState(() => {
    return new THREE.MeshPhysicalMaterial({
      // transparent: true,
      // opacity: 0.5,
      // map: makeTexture(16),
      // color: 0xff0000,
      color: COLORS.WHITE,
      // alphaMap: dimTexture(64, 2, (v, i) => (i - 3) % 4 ? ((i >> 2) % 2) * 255 : 255),
      // alphaMap: NoiseTexture.fromDimensions(1024, 64, 'RGBANoise'),
      // aoMap: NoiseTexture.fromDimensions(1023, 1, 'RGBANoise'),
      // alphaMap: NoiseTexture.fromDimensions(1023, 1, 'RGBAAlternate'),
      alphaTest: .5,
      // roughnessMap: dimTexture(8192, 64, (v, i) => (i - 3) % 4 ? ((i >> 2) % 2) * 255 : 255),
      // displacementMap: dimTexture(64, 64, (v, i) => (i - 3) % 4 ? ((i >> 2) % 2) * 255 : 255),
      normalMap: NoiseTexture.fromDimensions(1023, undefined, 'RGBAAlternate'),
      metalness: 100,
      fog: true,
      // bumpMap: NoiseTexture.fromDimensions(2048, 512),
      // bumpScale: 10,
      bumpScale: .008,
      // displacementMap: NoiseTexture.fromDimensions(128, 128),
      displacementScale: 0.25,
      displacementBias: .1,
      clearCoat: 1,
      clearCoatRoughness: 0.095,
      flatShading: true,
      // depthTest: false,
      side: THREE.DoubleSide,
      // wireframe: true,
    });
  });
  useEffect(() => {
    const fn = Utils.repeatTime(() => {
      material.displacementScale += Math.sin((Date.now() >> 3) / 64) / 100
      // material.displacementScale += Math.cos(Date.now() >> 8) / 50
      // material.color.offsetHSL(.01, 0, 0)
      // material.needsUpdate = true
    }, 0)
    fn.start()

    return fn.stop
  }, [material])
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const geometry = new THREE.TorusKnotBufferGeometry(5, .0025, props.shapeParams.tubularSegmentsBase << props.shapeParams.tubularSegmentsExp, props.shapeParams.radialSegments, props.shapeParams.axisRotations, props.shapeParams.tubeRotations);
    // const geometry = new THREE.OctahedronBufferGeometry(2, 1);
    const arr = geometry.getAttribute('position').array as Float32Array;
    for (let i = 0; i < arr.length; i += 6) {
      arr[i] = Math.sinh(arr[i] / 5) * 5
      arr[i + 1] = Math.sinh(arr[i + 1] / 5) * 5
      arr[i + 2] = Math.sinh(arr[i + 2])
      arr[i + 3] = ~~arr[i + 3]
      arr[i + 4] = ~~arr[i + 4]
      // arr[i] = (arr[i] + -~(arr[i])) / 2;
      // arr[i + 1] = ~~(4 * arr[i + 1]) / 4;
      // arr[i + 2] += (~~(8 * arr[i + 2]) ^ 3) / 8;

      // arr[i + 2] = ~~(8 * arr[i + 2]) / 4;
      // arr[i] += Math.cos(2 * Math.PI * i / arr.length / 3)
      // arr[i + 1] += (Math.random() - .5) / 2
      // arr[i + 2] += (Math.random() - .5) / 2
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(...rotation)
    mesh.castShadow = mesh.receiveShadow = true;

    camera.position.z = 20;
    camera.lookAt(mesh.position);

    const light1 = new THREE.PointLight(0xff8888, 1.4, 0, 1.2);
    light1.position.set(0, 2, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffff00, 1, 0, 2);
    light2.position.set(-2, 6, 0);
    scene.add(light2);

    const light3 = new THREE.PointLight(0x33ffff, 1, 0, 8);
    light3.position.set(2, 0, 3);
    scene.add(light3);

    const light4 = new THREE.AmbientLight(0xbbff00, .5)
    scene.add(light4)

    scene.add(mesh);

    const anim = Utils.repeatAnimation(() => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      mesh.rotation.z -= 0.01;
    })
    anim.start();
    // scene.fog = new THREE.FogExp2(0x000000, .06);
    // scene.fog = new THREE.FogExp2(0xeeffff, .04);
    return () => {
      anim.stop();
      setRotation(mesh.rotation.toArray() as [number, number, number])
      scene.remove(mesh, light1, light2, light3, light4)
    };
  }, [props.shapeParams.tubularSegmentsExp, props.shapeParams.tubularSegmentsBase, props.shapeParams.radialSegments, props.shapeParams.axisRotations, props.shapeParams.tubeRotations]);
  console.log('ping')
  // let mouseTransformFn = function transformValues() {
  //   if ((mesh.geometry instanceof THREE.BufferGeometry)) {
  //     const arr = mesh.geometry.attributes.position.array as Float32Array;
  //     // debugger
  //     const t = Date.now() >> 7;
  //     const dT = Math.random() * Math.PI / arr.length;
  //     for (let i = 0, d = t; i < arr.length; i += 3, d += dT) {
  //       // arr[i] += (mX - window.innerWidth / 2) / 10000
  //       // arr[i + 1] = ~~arr[i + 1]
  //       // arr[i + 2] = ~~arr[i + 2]
  //       // arr[i + 2] += Math.cos(d) / 2
  //       // arr[i + 1] += Math.sin(d) / 5
  //       // arr[i + 1] += Math.cos(Math.random() * Math.PI) / 100
  //       // arr[i + 2] *= Math.random()
  //     }
  //     // @ts-ignore
  //     mesh.geometry.attributes.position.needsUpdate = true;
  //     camera.lookAt(mesh.position)
  //   }
  // };
  // useEffect(() => {
  //   const fn = Utils.repeatAnimation(mouseTransformFn);
  //   fn.start()
  //   console.log('new animation')
  //
  //   return fn.stop
  // }, [mouseTransformFn])
  //
  // useMousemove((x, y) => {
  //   if (typeof x === 'undefined') return;
  //
  //   mouseTransformFn = (() => {
  //     if ((mesh.geometry instanceof THREE.BufferGeometry)) {
  //       const arr = mesh.geometry.attributes.position.array as Float32Array;
  //       // debugger
  //       const t = Date.now() >> 7;
  //       const dT = Math.random() * Math.PI / arr.length;
  //       for (let i = 0, d = t; i < arr.length; i += 3, d += dT) {
  //         arr[i] += (x - window.innerWidth / 2) / 10000
  //         // arr[i + 1] = ~~arr[i + 1]
  //         // arr[i + 2] = ~~arr[i + 2]
  //         // arr[i + 2] += Math.cos(d) / 2
  //         // arr[i + 1] += Math.sin(d) / 5
  //         // arr[i + 1] += Math.cos(Math.random() * Math.PI) / 100
  //         // arr[i + 2] *= Math.random()
  //       }
  //       // @ts-ignore
  //       mesh.geometry.attributes.position.needsUpdate = true;
  //       camera.lookAt(mesh.position)
  //     }
  //   })
  // })

  useEffect(() => {
    if (container.current === null) return;
    if (renderer === null) return;
    const { current } = container;

    current.appendChild(renderer.domElement)
  }, [renderer, container]);

  const [w, h] = useResponsive(container);

  useEffect(() => {
    updateThree(updateViewSize);
  }, [updateThree, w, h]);

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

  return (
    <ThreeContainer
      ref= { container }
    />
  );
}

export {
  Three
}
