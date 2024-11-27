// simulation.js
import * as d3 from 'd3';

const sigma = 5;
const numSamples = 1000;

// Information content function
export function informationContent(z) {
  return (2 * z) / sigma ** 2;
}

// MAP Action: returns 1 or -1 based on prior x and signal z
export function action(prevX, z) {
  return (prevX + informationContent(z) >= 0) ? 1 : -1;
}

// Bayesian Update for x using CDF
export function updateX(prevX, curAction) {
  const positiveSample = d3.range(numSamples).map(() => action(prevX, d3.randomNormal(1, sigma)()) === curAction).filter(Boolean).length / numSamples;
  const negativeSample = d3.range(numSamples).map(() => action(prevX, d3.randomNormal(-1, sigma)()) === curAction).filter(Boolean).length / numSamples;

  return prevX + Math.log(positiveSample / negativeSample);
}

// Generate signals
export function generateSignals(numCats, trueState) {
  return d3.range(numCats).map(() => d3.randomNormal(trueState, sigma)());
}

// Simulate Bayesian Social Learning
export function simulate(numCats) {
  const E = Math.random() < 0.5 ? 1 : -1; // True state
  const Zs = generateSignals(numCats, E); // Private signals
  const Xs = [0]; // Initial neutral belief
  const As = [];  // Action history

  for (let i = 0; i < numCats; i++) {
    const prevX = Xs[Xs.length - 1];
    const curAction = action(prevX, Zs[i]);
    const curX = updateX(prevX, curAction);

    Xs.push(curX);
    As.push(curAction);
  }

  return { beliefs: Xs, actions: As, trueState: E };
}
