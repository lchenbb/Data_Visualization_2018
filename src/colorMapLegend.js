
var colorbar = undefined;

function createD3LegendBox(svg, value) {
  const height = 40;
  const width = 280;
  const margin = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 50
  };
  console.log(value);
  if(colorbar !== undefined) {
    colorbar.remove();
  }

  // Add province name group
  colorbar = svg.append('g')
                      .attr('transform', 'translate(30, 30)')
                      .attr('width', 20 + margin.right);

  svg.append('text')
          .text('Legend')
          .attr('fill', 'black')
          .attr('font-size', 25)
          .attr('transform', 'translate(10, 20)');

  var w = 300, h = 50;

  var legend = colorbar.append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  const colorsObject = getColorsAndPercentages(value);
  addColorsToLegend(colorsObject.colors, colorsObject.percentages, legend);

  colorbar.append("rect")
    .attr("width", w)
    .attr("height", h - 30)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0,10)");

  var y = d3.scaleLinear()
    .range([0, 300])
    .domain([-100000, 100000]);

  var yAxis = d3.axisBottom()
    .scale(y)
    .ticks(3);

  colorbar.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,30)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("axis title");

}

function addColorsToLegend(colors, percentages, legend) {
  for(var i = 0; i < colors.length; ++i) {
    legend.append("stop")
      .attr("offset", percentages[i])
      .attr("stop-color", colors[i])
      .attr("stop-opacity", 1);
  }
}

function removeColorBar() {
  colorbar.remove();
}

function getColorsAndPercentages(value) {
  return colorsDefs[value];
}

function onDataChangeUpdateColorBar(svg) {
  const height = 40;
  const width = 280;
  const margin = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 50
  };
  var w = 300, h = 50;

  colorbar.remove();
  colorbar = svg.append('g')
                      .attr('transform', 'translate(30, 30)')
                      .attr('width', 20 + margin.right);

                      var legend = colorbar.append("defs")
                        .append("svg:linearGradient")
                        .attr("id", "gradient")
                        .attr("x1", "0%")
                        .attr("y1", "100%")
                        .attr("x2", "100%")
                        .attr("y2", "100%")
                        .attr("spreadMethod", "pad");


                      addColorsToLegend(colors, percentages, legend);

                      colorbar.append("rect")
                        .attr("width", w)
                        .attr("height", h - 30)
                        .style("fill", "url(#gradient)")
                        .attr("transform", "translate(0,10)");

                      var y = d3.scaleLinear()
                        .range([300, 0])
                        .domain([-100000, 100000]);

                      var yAxis = d3.axisBottom()
                        .scale(y)
                        .ticks(3);

                      colorbar.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(0,30)")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("axis title");

}
