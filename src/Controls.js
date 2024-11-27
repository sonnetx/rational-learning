import React from 'react';

function Controls({ numCats, setNumCats, initializeSimulation, addNextPerson, step, total }) {
  return (
    <div className="controls">
      <label>
        Number of Individuals:
        <input
          type="number"
          value={numCats}
          onChange={(e) => setNumCats(Number(e.target.value))}
        />
      </label>
      <button onClick={initializeSimulation}>Reset Simulation</button>
      <button onClick={addNextPerson} disabled={step >= total}>
        Add Next Person ({step + 1}/{total})
      </button>
    </div>
  );
}

export default Controls;
