import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { updateViewSize } from './updateViewSize';
import { useTHREE, useContainerForRenderer } from './hooks';
import { Utils } from '../utils';
import { ThreeContainer } from './ThreeContainer';
import { Materials, Lights, GeometryTransforms } from './builders';
import { useResponsive } from '../Components';

interface ThreeProps {
  shapeParams: {
    tubeDiameter: number;
    tubularSegments: number;
    radialSegments: number;
    axisRotations: number;
    tubeRotations: number;
    transformPoints: number;
    transformSkipPoints: number;
    scale: number;
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
    }, 0)
    fn.start()

    return fn.stop
  }, [material])
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  useEffect(() => {
    const {
      scale,
      radialSegments,
      axisRotations,
      transformSkipPoints,
      transformPoints,
      tubeDiameter,
      tubeRotations,
      tubularSegments,
    } = props.shapeParams;
    const geometry = new THREE.TorusKnotBufferGeometry(scale, tubeDiameter, tubularSegments, radialSegments, axisRotations, tubeRotations);
    GeometryTransforms.make.bitwiseXY(transformPoints, 1)(geometry);
    GeometryTransforms.make.sinhYZ(scale, transformSkipPoints)(geometry);
    GeometryTransforms.make.bitwiseXZ(transformPoints, transformSkipPoints)(geometry);
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
      mesh.rotation.z -= 0.02;
      updateRotation(mesh.rotation.toArray() as [number, number, number])
    })
    anim.start();
    return () => {
      anim.stop();
      scene.remove(mesh)
    };
  }, [
      props.shapeParams.scale,
      props.shapeParams.tubeDiameter,
      props.shapeParams.tubularSegments,
      props.shapeParams.radialSegments,
      props.shapeParams.axisRotations,
      props.shapeParams.tubeRotations,
      props.shapeParams.transformPoints,
      props.shapeParams.transformSkipPoints,
    ]);
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
