import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Chart({ actions }) {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();
    const width = 600, height = 300;
    
    svg.attr('width', width).attr('height', height);

    svg.selectAll('circle')
      .data(actions)
      .enter()
      .append('circle')
      .attr('cx', (_, i) => (i % 10) * 60 + 30)
      .attr('cy', (_, i) => Math.floor(i / 10) * 40 + 30)
      .attr('r', 15)
      .attr('fill', (d) => (d === 1 ? 'blue' : 'orange'))
      .attr('stroke', 'black');
  }, [actions]);

  return <svg ref={chartRef}></svg>;
}

export default Chart;
