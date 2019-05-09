import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { updateViewSize } from './updateViewSize';
import { useTHREE, useContainerForRenderer } from './hooks';
import { Utils } from '../utils';
import { ThreeContainer } from './ThreeContainer';
import { Materials, Lights } from './builders';
import { useResponsive } from '../Components';

interface ThreeProps {
  shapeParams: {
    tubeDiameter: number;
    tubularSegmentsBase: number;
    tubularSegmentsExp: number;
    radialSegments: number;
    axisRotations: number;
    tubeRotations: number;
  },
  lightParams: {
    positions: number[]
  }
}
function Three(props: ThreeProps) {
  const [
    renderer, camera, scene,
    updateThree
  ] = useTHREE();

  const container = React.createRef<HTMLDivElement>();
  const [material] = useState(Materials.make.PearlMetal);
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
    const geometry = new THREE.TorusKnotBufferGeometry(5, props.shapeParams.tubeDiameter / 1000, props.shapeParams.tubularSegmentsBase << props.shapeParams.tubularSegmentsExp, props.shapeParams.radialSegments, props.shapeParams.axisRotations, props.shapeParams.tubeRotations);
    // const geometry = new THREE.OctahedronBufferGeometry(2, 1);
    const arr = geometry.getAttribute('position').array as Float32Array;
    for (let i = 0; i < arr.length; i += 6) {
      arr[i] = Math.sinh(arr[i] / 5) * 5
      arr[i + 1] = Math.sinh(arr[i + 1] / 5) * 5
      arr[i + 2] = Math.sinh(arr[i + 2])
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.fromArray(rotation)
    mesh.castShadow = mesh.receiveShadow = true;

    camera.position.z = 20;
    camera.lookAt(mesh.position);

    scene.add(mesh);

    const updateRotation = Utils.debounce(setRotation, 0);

    const anim = Utils.repeatAnimation(() => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      mesh.rotation.z -= 0.01;
      updateRotation(mesh.rotation.toArray() as [number, number, number])
    })
    anim.start();
    return () => {
      anim.stop();
      scene.remove(mesh)
    };
  }, [props.shapeParams.tubeDiameter, props.shapeParams.tubularSegmentsExp, props.shapeParams.tubularSegmentsBase, props.shapeParams.radialSegments, props.shapeParams.axisRotations, props.shapeParams.tubeRotations]);
  useEffect(() => {
    const light1 = Lights.makePoint('ROSE', [1.4, 0, 1.2], props.lightParams.positions.slice(0, 3));
    scene.add(light1);

    const light2 = Lights.makePoint('YELLOW', [1, 0, 2], props.lightParams.positions.slice(3, 6));
    scene.add(light2);

    const light3 = Lights.makePoint('CYAN_S', [1, 0, 8], props.lightParams.positions.slice(6, 9));
    scene.add(light3);

    const light4 = Lights.make.Ambient('LIME', .5)
    scene.add(light4);


    return () => {
      scene.remove(light1, light2, light3, light4)
    };
  }, [props.lightParams])
  useContainerForRenderer(renderer, container);

  const [w, h] = useResponsive(container);

  useEffect(() => {
    updateThree(updateViewSize);
  }, [updateThree, w, h]);

  return (
    <ThreeContainer
      ref= { container }
    />
  );
}

export {
  Three
}
