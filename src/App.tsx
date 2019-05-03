import React, { useState } from 'react';
import './App.css';
import { Three } from './Three';

const App: React.FC = () => {
  const [tubularSegmentsBase, setTubularSegmentsBase] = useState(128);
  const [tubularSegmentsExp, setTubularSegmentsExp] = useState(3);
  const [radialSegments, setParam1] = useState(3);
  const [axisRotations, setParam2] = useState(19);
  const [tubeRotations, setParam3] = useState(11);
  return (
    <div className="App">
      <Three shapeParams={{
        tubularSegmentsExp,
        tubularSegmentsBase,
        radialSegments,
        axisRotations,
        tubeRotations
      }} />
      <input type="number" onChange={e => setTubularSegmentsBase(Number(e.target.value))} value={tubularSegmentsBase} />
      <input type="number" onChange={e => setTubularSegmentsExp(Number(e.target.value))} value={tubularSegmentsExp} />
      <input type="number" onChange={e => setParam1(Number(e.target.value))} value={radialSegments} />
      <input type="number" onChange={e => setParam2(Number(e.target.value))} value={axisRotations} />
      <input type="number" onChange={e => setParam3(Number(e.target.value))} value={tubeRotations} />
    </div>
  );
}

export default App;
