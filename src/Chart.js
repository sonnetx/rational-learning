import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Chart({ actions }) {
  const chartRef = useRef();

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 800, height = 400;
    const margin = { top: 20, right: 50, bottom: 40, left: 60 };

    svg.attr('width', width).attr('height', height);

    // const xScale = d3.scaleBand().domain(actions.map((_, i) => i)).range([100, width - 100]).padding(0.1);
    // const yScale = d3.scaleBand().domain([-1, 1]).range([height - 50, 50]).padding(0.1);
    const xScale = d3.scaleBand().domain(actions.map((_, i) => i)).range([40, width - 20]).padding(0.1);
    const yScale = d3.scaleBand().domain([-1, 1]).range([height - 20, 20]).padding(0.1);

    // const xScale = d3.scaleLinear()
    //   .domain([1, actions.length])
    //   .range([margin.left, width - margin.right]);

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', `translate(40,0)`);

    svg.append('g')
      .call(d3.axisBottom(xScale).ticks(10, 's'))
      .attr('transform', `translate(0,${height - 20})`);

    svg.selectAll('.bar')
      .data(actions)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', 'orange');

    svg.append('text')
      .attr('x', width - 120)
      .attr('y', 30)
      .text(`Last Action: ${actions[actions.length - 1]}`)
      .attr('fill', 'black');

    svg.append('text')
      .attr('x', width / 2 - 40)
      .attr('y', height + 5 + 5) // add 5px padding
      .text('Person Index')
      .attr('fill', 'black');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15 + 5)
      .text('Actions')
      .attr('fill', 'black');
  }, [actions]);

  return <svg ref={chartRef}></svg>;
}

export default Chart;

