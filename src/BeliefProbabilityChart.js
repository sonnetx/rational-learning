import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BeliefProbabilityChart({ simulations }) {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 600, height = 300;

    svg.attr('width', width).attr('height', height);

    const xScale = d3.scaleLinear().domain([-1.5, 1.5]).range([40, width - 20]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([height - 20, 20]);

    const line = d3.line()
      .x((d) => xScale(d.belief))
      .y((d) => yScale(d.probability));

    const colors = d3.schemeTableau10;

    simulations.forEach((sim, i) => {
      const beliefProbabilityData = sim.beliefs.map((belief, idx) => ({
        belief,
        probability: computeProbabilityOfCorrectAction(belief, sim.trueState),
      }));

      svg.append('path')
        .datum(beliefProbabilityData)
        .attr('fill', 'none')
        .attr('stroke', colors[i % colors.length])
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', 'translate(40,0)');

    svg.append('g')
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".2f")))
      .attr('transform', `translate(0,${height - 20})`);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height)
      .attr('text-anchor', 'middle')
      .text('Belief');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Probability of Correct Action');
  }, [simulations]);

  const computeProbabilityOfCorrectAction = (belief, trueState) => {
    const predictedAction = belief >= 0 ? 1 : -1;
    return predictedAction === trueState ? 1 : 0;
  };

  return <svg ref={chartRef}></svg>;
}

export default BeliefProbabilityChart;
