import React, { useState } from 'react';
import './App.css';
import { Three } from './Three';
import { useInputComponent } from './Components';
import { Utils } from './utils';

class ErrorBoundary extends React.Component<{ backToSafety?: Function }> {
  componentDidCatch(error: any, info: any) {
    console.log(error, info)
    if (this.props.backToSafety) this.props.backToSafety(error);
  }
  render() { return this.props.children }
}

const App: React.FC = () => {
  const [tubularSegmentsBase, tubularSegmentsBaseInput] = useInputComponent(24);
  const [tubularSegmentsExp, tubularSegmentsExpInput] = useInputComponent(3);
  const [radialSegments, radialSegmentsInput] = useInputComponent(6);
  const [tubeDiameter, tubeDiameterInput] = useInputComponent(320);
  const [axisRotations, axisRotationsInput] = useInputComponent(2);
  const [tubeRotations, tubeRotationsInput] = useInputComponent(3);
  const [transformPoints, transformPointsInput] = useInputComponent(2);
  const [transformSkipPoints, transformSkipPointsInput] = useInputComponent(2);
  const [scale, scaleInput] = useInputComponent(50);
  const [lightPositions, setLightPositions] = useState([
    0, 2, 3,
    -2, 6, 0,
    2, 0, 3,
  ]);
  const tubularSegments = tubularSegmentsBase << tubularSegmentsExp;
  return (
    <div className="App">
      <ErrorBoundary backToSafety={() => {
      }}>
        <Three shapeParams={{
          scale: scale / 10,
          tubularSegments,
          radialSegments,
          axisRotations,
          tubeRotations,
          tubeDiameter: tubeDiameter / 1000,
          transformPoints,
          transformSkipPoints,
        }} lightParams={{ positions: lightPositions }} />
        <button onClick={() => {
          setLightPositions(
            lightPositions.map(() => Utils.biRandom() * 7).slice()
          )
        }} >
          Randomize Lights
        </button>
        <div>
          {scaleInput}/10 :
          {tubeDiameterInput}/1000
        </div>
        <div>
          {tubularSegmentsBaseInput}
          {"<<"}
          {tubularSegmentsExpInput}
          {radialSegmentsInput}
        </div>
        <div>
          {axisRotationsInput}
          {tubeRotationsInput}
        </div>
        <div>
          {transformPointsInput}
          {transformSkipPointsInput}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
