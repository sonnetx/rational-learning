import React, { useState } from 'react';
import { simulate, action, updateX, generateSignals } from './simulation';
import Chart from './Chart';
import ProbabilityChart from './ProbabilityChart';
import Controls from './Controls';

function App() {
  const [numCats, setNumCats] = useState(500);
  const [beliefs, setBeliefs] = useState([0]);
  const [actions, setActions] = useState([]);
  const [signals, setSignals] = useState([]);
  const [trueState, setTrueState] = useState(0);
  const [step, setStep] = useState(0);

  const initializeSimulation = () => {
    const E = Math.random() < 0.5 ? 1 : -1; // True state
    const Zs = generateSignals(numCats, E); // Private signals
    setSignals(Zs);
    setTrueState(E);
    setBeliefs([0]);
    setActions([]);
    setStep(0);
  };

  const addNextPerson = () => {
    if (step < signals.length) {
      const prevX = beliefs[beliefs.length - 1];
      const curSignal = signals[step];
      const curAction = action(prevX, curSignal);
      const curX = updateX(prevX, curAction);

      setBeliefs((prev) => [...prev, curX]);
      setActions((prev) => [...prev, curAction]);
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="app">
      <h1>Interactive Bayesian Social Learning</h1>
      <Controls
        numCats={numCats}
        setNumCats={setNumCats}
        initializeSimulation={initializeSimulation}
        addNextPerson={addNextPerson}
        step={step}
        total={signals.length}
      />
      <div className="visualizations">
        <Chart actions={actions} />
        <ProbabilityChart beliefs={beliefs} trueState={trueState} />
      </div>
    </div>
  );
}

export default App;
