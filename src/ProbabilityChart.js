import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ProbabilityChart({ beliefs, trueState }) {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 600, height = 300;

    svg.attr('width', width).attr('height', height);

    const xScale = d3.scaleLog().domain([1, beliefs.length]).range([40, width - 20]);
    const yScale = d3.scaleLinear().domain([-1.5, 1.5]).range([height - 20, 20]);

    const line = d3.line()
      .x((_, i) => xScale(i + 1))
      .y((d) => yScale(d * trueState));

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', 'translate(40,0)');

    svg.append('g')
      .call(d3.axisBottom(xScale).ticks(10))
      .attr('transform', `translate(0,${height - 20})`);

    svg.append('path')
      .datum(beliefs)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [beliefs, trueState]);

  return <svg ref={chartRef}></svg>;
}

export default ProbabilityChart;
