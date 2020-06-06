/*global window, console, d3 */
/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

//Define Margin
var margin = {left: 80, right: 100, top: 50, bottom: 50 }, 
width = 960 - margin.left -margin.right,
height = 500 - margin.top - margin.bottom;

var duration = 3000;
var svg = d3.select("body")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

dataset = [30, 80, 90, 100, 150, 200, 300];

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var circle = svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle");

  dataset.forEach(function(d, i) {
    circle.transition().duration(duration).delay(i * duration)
        .attr("r", i);
});
circle
  .attr("cx", 500)
  .attr("cy", height/2)
  .attr("r", dataset[0])
  .attr("fill", "orange");

