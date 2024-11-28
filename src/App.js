import React, { useState } from 'react';
import { action, updateX, generateSignals, simulateWithSampling } from './simulation';
import Chart from './Chart';
import ProbabilityChart from './ProbabilityChart';
import Controls from './Controls';
import * as d3 from 'd3';

function App() {
  // Step-by-step simulation states
  const [stepBeliefs, setStepBeliefs] = useState([0]);
  const [stepActions, setStepActions] = useState([]);
  const [stepSignals, setStepSignals] = useState([]);
  const [stepTrueState, setStepTrueState] = useState(0);
  const [stepCounter, setStepCounter] = useState(0);
  const [stepCIs, setStepCIs] = useState([]);

  // Random sampling simulation states
  const [samplingBeliefs, setSamplingBeliefs] = useState([0]);
  const [samplingActions, setSamplingActions] = useState([]);
  const [samplingTrueState, setSamplingTrueState] = useState(0);
  const [samplingCIs, setSamplingCIs] = useState([]);

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

    const cis = [];
    for (let i = 0; i < beliefs.length; i++) {
      const lower = d3.quantile(beliefs.slice(0, i + 1), 0.025);
      const upper = d3.quantile(beliefs.slice(0, i + 1), 0.975);
      cis.push([lower, upper]);
    }
    setSamplingCIs(cis);
  };

  // Complete the entire step-by-step simulation at once
  const completeStepSimulation = () => {
    let beliefs = [0];
    let actions = [];
    let cis = [[0, 0]]; // Initialize with first belief CI
  
    for (let i = 0; i < stepSignals.length; i++) {
      const prevX = beliefs[beliefs.length - 1];
      const curSignal = stepSignals[i];
      const curAction = action(prevX, curSignal);
      const curX = updateX(prevX, curAction);
  
      // Generate samples to calculate CI
      const randomNormal = d3.randomNormal(curX, 1); // Mean = curX, Std dev = 1
      const samples = Array.from({ length: 1000 }, randomNormal); // 1000 samples
  
      const lower = d3.quantile(samples, 0.025); // 2.5th percentile
      const upper = d3.quantile(samples, 0.975); // 97.5th percentile
  
      beliefs.push(curX);
      actions.push(curAction);
      cis.push([lower, upper]);
    }
  
    setStepBeliefs(beliefs);
    setStepActions(actions);
    setStepCounter(stepSignals.length);
    setStepCIs(cis);
  };
  


  return (
    <div className="app">
      <header className="App-header">
        <h1>Bayesian Social Learning Simulator</h1>
        <p>
          This app models how individuals sequentially make decisions based on private signals and observed actions.
          The true state of the world can be +1 or -1. Each person receives a private signal, updating their belief and
          deciding whether to take action +1 or -1. The simulation visualizes how beliefs evolve over time and how
          group consensus emerges.
        </p>
        <p>
          <strong>Private Signal (z)</strong>: Individual signal influenced by the true state.<br />
          <strong>True State (E)</strong>: The hidden condition, either +1 or -1.<br />
          <strong>Belief (X)</strong>: Updated belief based on previous actions.<br />
          <strong>Action (A)</strong>: The decision an individual takes (either +1 or -1).
        </p>
        <p>
          This simulator demonstrates how individuals update their beliefs and take actions based on private signals and
          observed decisions. The two modes available: <strong>Step-by-Step Simulation</strong> and <strong>Random
          Sampling Simulation</strong>.
        </p>
        <p>
          Click <strong>Add Next Person</strong> to simulate their action and update group beliefs. Observe how belief
          stabilizes as more individuals contribute.
        </p>
      </header>

      <div className="simulation-comparison">
      {/* Step-by-Step Simulation */}
      <div className="simulation-section">
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
      </div>

      {/* Random Sampling Simulation */}
      <div className="simulation-section">
        <h2>Random Sampling Simulation</h2>
        <Controls
          numIndividuals={numIndividuals}
          setNumIndividuals={setNumIndividuals}
          sampleSize={sampleSize}
          setSampleSize={setSampleSize}
          runSimulation={runSamplingSimulation}
        />
        <div className="visualizations">
          <ProbabilityChart beliefs={samplingBeliefs} trueState={samplingTrueState} />
          <Chart actions={samplingActions} />
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
