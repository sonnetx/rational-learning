import React, { useState } from 'react';
import Chart from './Chart';
import Controls from './Controls';
import ProbabilityChart from './ProbabilityChart';
import { simulateStep } from './simulation';

function App() {
  const [numIndividuals, setNumIndividuals] = useState(100);
  const [signalAccuracy, setSignalAccuracy] = useState(0.8);
  const [actions, setActions] = useState([]);
  const [beliefs, setBeliefs] = useState([0.5]); // Initial neutral belief

  const addIndividual = () => {
    const { newBelief, action } = simulateStep(beliefs[beliefs.length - 1], signalAccuracy);
    setBeliefs((prev) => [...prev, newBelief]);
    setActions((prev) => [...prev, action]);
  };

  return (
    <div className="app">
      <h1>Rational Social Learning Simulation</h1>
      <Controls 
        numIndividuals={numIndividuals}
        setNumIndividuals={setNumIndividuals}
        signalAccuracy={signalAccuracy}
        setSignalAccuracy={setSignalAccuracy}
        addIndividual={addIndividual}
      />
      <div className="visualizations">
        <Chart actions={actions} />
        <ProbabilityChart beliefs={beliefs} />
      </div>
      <p className="probability">
        The updated probability is: {beliefs[beliefs.length - 1]}
      </p>
    </div>
  );
}

export default App;
