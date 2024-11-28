// simulation.js
import * as d3 from 'd3';

const sigma = 5;
const numSamples = 1000;

// Information content from private signal
export function informationContent(z) {
  return (2 * z) / sigma ** 2;
}

// Determine action (1 or -1) based on belief and signal
export function action(prevX, z) {
  return prevX + informationContent(z) >= 0 ? 1 : -1;
}

// Update belief using all prior actions
export function updateX(prevX, curAction) {
  const posSamples = d3.range(numSamples).map(() => action(prevX, d3.randomNormal(1, sigma)()) === curAction).filter(Boolean).length / numSamples;
  const negSamples = d3.range(numSamples).map(() => action(prevX, d3.randomNormal(-1, sigma)()) === curAction).filter(Boolean).length / numSamples;

  return prevX + Math.log(posSamples / negSamples);
}

// Random sampling belief update
function randomSample(actions, sampleSize) {
  return d3.shuffle(actions).slice(0, sampleSize);
}

// Simulate with random sampling
export function simulateWithSampling(numIndividuals, sampleSize) {
  const trueState = Math.random() < 0.5 ? 1 : -1;
  const signals = generateSignals(numIndividuals, trueState);
  const actions = [];
  const beliefs = [0];

  for (let i = 0; i < numIndividuals; i++) {
    const prevX = beliefs[beliefs.length - 1];
    const curSignal = signals[i];
    const curAction = action(prevX, curSignal);

    actions.push(curAction);

    const sampledActions = randomSample(actions, sampleSize);
    const newX = updateX(prevX, curAction, sampledActions);

    beliefs.push(newX);
  }

  return { beliefs, actions, trueState };
}

// Generate signals
export function generateSignals(numIndividuals, trueState) {
  return d3.range(numIndividuals).map(() => d3.randomNormal(trueState, sigma)());
}
