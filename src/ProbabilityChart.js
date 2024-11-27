import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ProbabilityChart({ beliefs }) {
  const chartRef = useRef();

  useEffect(() => {
    const width = 600, height = 300;
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove(); // Clear previous render

    const xScale = d3.scaleLinear().domain([0, beliefs.length - 1]).range([40, width - 20]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([height - 20, 20]);

    const line = d3.line()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d));

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.1f')))
      .attr('transform', 'translate(40,0)');

    svg.append('g')
      .call(d3.axisBottom(xScale).ticks(beliefs.length))
      .attr('transform', `translate(0,${height - 20})`);

    svg.append('path')
      .datum(beliefs)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [beliefs]);

  return <svg ref={chartRef}></svg>;
}

export default ProbabilityChart;
