document.addEventListener('DOMContentLoaded', function() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const dataset = data.data;
      const w = 800;
      const h = 400;
      const padding = 50;

      const svg = d3.select('#chart')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

      const xScale = d3.scaleBand()
                       .domain(dataset.map(d => new Date(d[0])))
                       .range([padding, w - padding])
                       .padding(0.1);

      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, d => d[1])])
                       .range([h - padding, padding]);

      const xAxis = d3.axisBottom(xScale)
                      .tickFormat(d3.timeFormat("%Y"));

      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
         .attr('id', 'x-axis')
         .attr('transform', `translate(0, ${h - padding})`)
         .call(xAxis);

      svg.append('g')
         .attr('id', 'y-axis')
         .attr('transform', `translate(${padding}, 0)`)
         .call(yAxis);

      svg.selectAll('.bar')
         .data(dataset)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .attr('x', d => xScale(new Date(d[0])))
         .attr('y', d => yScale(d[1]))
         .attr('width', xScale.bandwidth())
         .attr('height', d => h - padding - yScale(d[1]))
         .attr('data-date', d => d[0])
         .attr('data-gdp', d => d[1])
         .on('mouseover', function(event, d) {
           d3.select('#tooltip')
             .style('opacity', 0.9)
             .style('left', (event.pageX + 5) + 'px')
             .style('top', (event.pageY - 28) + 'px')
             .attr('data-date', d[0])
             .html(`Date: ${d[0]}<br>GDP: ${d[1]} Billion`);
         })
         .on('mouseout', function() {
           d3.select('#tooltip')
             .style('opacity', 0);
         });
    });
});