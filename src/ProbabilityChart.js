import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ProbabilityChart({ beliefs, trueState }) {
  if (!Array.isArray(beliefs)) {
    beliefs = [beliefs];
  }
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 600, height = 300;
    const margin = { top: 20, right: 50, bottom: 40, left: 60 };

    svg.attr('width', width).attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([1, beliefs.length])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([-1.5, 1.5])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((_, i) => xScale(i + 1))
      .y((d) => yScale(d * trueState));

    // Add Axes
    svg.append('g')
      .call(d3.axisLeft(yScale).tickFormat((d) => `${d}`))
      .attr('transform', `translate(${margin.left},0)`);

    svg.append('g')
      .call(d3.axisBottom(xScale).ticks(10, d3.format('.0f')))
      .attr('transform', `translate(0,${height - margin.bottom})`);

    // Calculate and add Confidence Interval Area
    const cis = beliefs.map((_, i) => {
      const currentSlice = beliefs.slice(0, i + 1).sort((a, b) => a - b);
      const lowerIndex = Math.floor(currentSlice.length * 0.025);
      const upperIndex = Math.floor(currentSlice.length * 0.975);
      return [
        currentSlice[lowerIndex] || 0,
        currentSlice[upperIndex] || 0
      ];
    });


    // const ciArea = d3.area()
    //   .x((_, i) => xScale(i + 1))
    //   .y0((d) => yScale(d[0] * trueState))
    //   .y1((d) => yScale(d[1] * trueState));

    // svg.append('path')
    //   .datum(cis)
    //   .attr('d', ciArea)
    //   .style('fill', '#ccc')
    //   .style('stroke', 'none');

    // Line Path for Beliefs
    svg.append('path')
      .datum(beliefs)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add latest and prior belief text
    const latestBelief = beliefs.length > 1 ? beliefs[beliefs.length - 1].toFixed(3) : 'N/A';
    const priorBelief = beliefs.length > 1 ? beliefs[beliefs.length - 2].toFixed(3) : 'N/A';

    svg.append('text')
      .attr('x', width - margin.right - 120)
      .attr('y', margin.top + 10)
      .text(`Confidence: ${latestBelief}`)
      .attr('fill', 'black');

    svg.append('text')
      .attr('x', width - margin.right - 120)
      .attr('y', margin.top + 30)
      .text(`Prior: ${priorBelief}`)
      .attr('fill', 'black');

    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .text('Number of Individuals')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .text('Confidence')
      .attr('text-anchor', 'middle')
      .attr('fill', 'black');
  }, [beliefs, trueState]);

  return <svg ref={chartRef}></svg>;
}

export default ProbabilityChart;
