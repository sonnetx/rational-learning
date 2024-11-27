import React from 'react';

function Controls({ signalAccuracy, setSignalAccuracy, addIndividual }) {
  return (
    <div className="controls">
      <label>
        Signal Accuracy: 
        <input type="number" step="0.01" value={signalAccuracy} onChange={(e) => setSignalAccuracy(parseFloat(e.target.value))} />
      </label>
      <button onClick={addIndividual}>Add Individual</button>
    </div>
  );
}

export default Controls;
