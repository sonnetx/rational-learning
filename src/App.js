import React, { useState } from 'react';
import { action, updateX, generateSignals, simulateWithSampling } from './simulation';
import Chart from './Chart';
import ProbabilityChart from './ProbabilityChart';
import Controls from './Controls';

function App() {
  // Step-by-step simulation states
  const [stepBeliefs, setStepBeliefs] = useState([0]);
  const [stepActions, setStepActions] = useState([]);
  const [stepSignals, setStepSignals] = useState([]);
  const [stepTrueState, setStepTrueState] = useState(0);
  const [stepCounter, setStepCounter] = useState(0);

  // Random sampling simulation states
  const [samplingBeliefs, setSamplingBeliefs] = useState([0]);
  const [samplingActions, setSamplingActions] = useState([]);
  const [samplingTrueState, setSamplingTrueState] = useState(0);

  // Shared parameters
  const [numIndividuals, setNumIndividuals] = useState(50);
  const [sampleSize, setSampleSize] = useState(10);

  // Initialize step-by-step simulation
  const initializeStepSimulation = () => {
    const trueState = Math.random() < 0.5 ? 1 : -1; // True state
    const signals = generateSignals(numIndividuals, trueState);
    setStepSignals(signals);
    setStepTrueState(trueState);
    setStepBeliefs([0]); // Reset beliefs
    setStepActions([]); // Reset actions
    setStepCounter(0); // Reset counter
  };

  // Add the next person in step-by-step simulation
  const addNextPersonStep = () => {
    if (stepCounter < stepSignals.length) {
      const prevX = stepBeliefs[stepBeliefs.length - 1];
      const curSignal = stepSignals[stepCounter];
      const curAction = action(prevX, curSignal);
      const curX = updateX(prevX, curAction);

      setStepBeliefs((prev) => [...prev, curX]);
      setStepActions((prev) => [...prev, curAction]);
      setStepCounter((prev) => prev + 1);
    }
  };

  // Run random sampling simulation
  const runSamplingSimulation = () => {
    const { beliefs, actions, trueState } = simulateWithSampling(numIndividuals, sampleSize);
    setSamplingBeliefs(beliefs);
    setSamplingActions(actions);
    setSamplingTrueState(trueState);
  };

  // Complete the entire step-by-step simulation at once
  const completeStepSimulation = () => {
    let beliefs = [0];
    let actions = [];
    for (let i = 0; i < stepSignals.length; i++) {
      const prevX = beliefs[beliefs.length - 1];
      const curSignal = stepSignals[i];
      const curAction = action(prevX, curSignal);
      const curX = updateX(prevX, curAction);

      beliefs.push(curX);
      actions.push(curAction);
    }

    setStepBeliefs(beliefs);
    setStepActions(actions);
    setStepCounter(stepSignals.length);
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
          This simulator demonstrates how individuals update their beliefs and take actions based on private signals and
          observed decisions. The two modes available:
          <strong>Step-by-Step Simulation:</strong> Beliefs are updated iteratively using all previous actions.
          <strong>Random Sampling Simulation:</strong> Beliefs are updated using a randomly selected subset of prior
            actions.
        </p>
        <p>
          Click <strong>Add Next Person</strong> to simulate their action and update group beliefs. Observe how belief
          stabilizes as more individuals contribute.
        </p>
      </header>

      {/* Step-by-Step Simulation */}
      <h2>Step-by-Step Simulation</h2>
      <Controls
        numIndividuals={numIndividuals}
        setNumIndividuals={setNumIndividuals}
        initializeSimulation={initializeStepSimulation}
        addNextPerson={addNextPersonStep}
        completeSimulation={completeStepSimulation}
        step={stepCounter}
        total={stepSignals.length}
      />
      <div className="visualizations">
        <ProbabilityChart beliefs={stepBeliefs} trueState={stepTrueState} />
        <Chart actions={stepActions} />
      </div>

      {/* Random Sampling Simulation */}
      <h2>Random Sampling Simulation</h2>
      <Controls
        numIndividuals={numIndividuals}
        setNumIndividuals={setNumIndividuals}
        sampleSize={sampleSize}
        setSampleSize={setSampleSize}
        runSimulation={runSamplingSimulation}
      />
      <div className="charts">
        <ProbabilityChart beliefs={samplingBeliefs} trueState={samplingTrueState} />
        <Chart actions={samplingActions} />
      </div>
    </div>
  );
}

export default App;
