import React, { useState } from 'react';
import './App.css';
import { Three } from './Three';
import { useInputComponent } from './Components';
import { Utils } from './utils';

const App: React.FC = () => {
  const [tubularSegmentsBase, TubularSegmentsBaseInput] = useInputComponent(24);
  const [tubularSegmentsExp, TubularSegmentsExpInput] = useInputComponent(0);
  const [radialSegments, RadialSegmentsInput] = useInputComponent(16);
  const [tubeDiameter, TubeDiameterInput] = useInputComponent(320);
  const [axisRotations, AxisRotationsInput] = useInputComponent(17);
  const [tubeRotations, TubeRotationsInput] = useInputComponent(7);
  const [lightPositions, setLightPositions] = useState([
    0, 2, 3,
    -2, 6, 0,
    2, 0, 3,
  ]);
  return (
    <div className="App">
      <Three shapeParams={{
        tubularSegmentsExp,
        tubularSegmentsBase,
        radialSegments,
        axisRotations,
        tubeRotations,
        tubeDiameter,
      }} lightParams={{ positions: lightPositions }} />
      <button onClick={() => {
        setLightPositions(
          lightPositions.map(() => Utils.biRandom() * 7).slice()
        )
      }} >
        Randomize Lights
    </button>
      {TubeDiameterInput}/1000
      {TubularSegmentsBaseInput}
      {"<<"}
      {TubularSegmentsExpInput}
      {RadialSegmentsInput}
      {AxisRotationsInput}
      {TubeRotationsInput}
    </div>
  );
}

export default App;
