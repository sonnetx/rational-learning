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
      <header className="App-header">
        <h1>Bayesian Social Learning Simulator</h1>
        <p>
          This app models how individuals sequentially make decisions based on their private signals and observed
          actions. The true state of the world can be +1 or -1. Each person receives a private signal, updating their
          belief and deciding whether to take action +1 or -1. The simulation visualizes how beliefs evolve over time
          and how group consensus emerges.
        </p>
          <p><strong>Private Signal (z)</strong>: Individual signal influenced by the true state.</p>
          <p><strong>True State (E)</strong>: The hidden condition, either +1 or -1.</p>
          <p><strong>Belief (X)</strong>: Updated belief based on previous actions.</p>
          <p><strong>Action (A)</strong>: The decision an individual takes (either +1 or -1).</p>
        <p>
          Click <strong>Add Next Person</strong> to simulate their action and update group beliefs. Observe how belief
          stabilizes as more individuals contribute.
        </p>
      </header>

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
