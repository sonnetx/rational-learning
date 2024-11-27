export function simulateStep(priorBelief, signalAccuracy) {
    const generatePrivateSignal = (p) => Math.random() < p ? 1 : 0;
  
    const updateBelief = (prior, signal) => {
      const pSignalGivenState1 = signal === 1 ? signalAccuracy : 1 - signalAccuracy;
      const pSignalGivenState0 = signal === 1 ? 1 - signalAccuracy : signalAccuracy;
      const likelihood1 = prior * pSignalGivenState1;
      const likelihood0 = (1 - prior) * pSignalGivenState0;
      const posterior = likelihood1 / (likelihood1 + likelihood0);

      return prior * (1 - 0.5 * (1 - posterior)) + 0.5 * posterior;
    };

  
    const signal = generatePrivateSignal(signalAccuracy);
    const newBelief = updateBelief(priorBelief, signal);
    const action = newBelief >= 0.5 ? 1 : 0;
  
    return { newBelief, action };
  }
  