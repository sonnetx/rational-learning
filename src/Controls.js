import React from 'react';

function Controls({ numIndividuals, setNumIndividuals, sampleSize, setSampleSize, initializeSimulation, addNextPerson, completeSimulation, runSimulation, step, total }) {
  return (
    <div className="controls">
      <label>
        Number of Individuals:
        <input
          type="number"
          value={numIndividuals}
          onChange={(e) => setNumIndividuals(Number(e.target.value))}
        />
      </label>

      {initializeSimulation && addNextPerson && completeSimulation && (
        <>
          <button onClick={initializeSimulation}>Reset Simulation</button>
          <button onClick={addNextPerson} disabled={step >= total}>
            Add Next Person ({step}/{total})
          </button>
          <button onClick={completeSimulation} disabled={step >= total}>
            Complete Simulation
          </button>
        </>
      )}

      {runSimulation && (
        <>
          <label>
            Sample Size:
            <input
              type="number"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
            />
          </label>
          <button onClick={runSimulation}>Run Sampling Simulation</button>
        </>
      )}
    </div>
  );
}

export default Controls;
