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
// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below
var arr = [];
var counter = 0;


var dict = {
  "UnitedStates": 0,
  "Russia":0,
  "SouthAfrica":0,
    "China":0,
    "Brazil":0,
    "India":0
};


//The margins are how much space it is from the left/right/top/bottom
var margin = {top: 10, right: 90, bottom: 150, left: 80},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var parseTime = d3.timeParse("%Y");


// x,y,z scales 
// scaleordinal groups by "countries"
// .domain to get different colors for each country
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    // x and y are our regular scales
    z = d3.scaleOrdinal(d3.schemeCategory10);
    // z is the color scale

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) 
    {
        return x(d.year);  // d.year is parsed already
    }) 
    .y(function(d) 
    {
        return y(d.value); 
    }); // d contains "value" not values

    // not my code from 61-70
    function make_x_gridlines() 
    {		
        return d3.axisBottom(x)
        .ticks(5)
}
// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}

// converting csv to tsv
d3.csv("BRICSdata.csv").then(function(data) {
    
// gets rid of first column bc its country
    var years = data.columns.slice(1);
    var countries = data.map(function (row){
        return{
            // puts the real Country Name into country name 
            countryname: row["Country Name"],
            values: years.map(function(year)
            {
                return{
                    year: parseTime(year),value: +row[year]};
            }),
                };
            });
    
    //puts years into x bc thats what parseTime returns
    x.domain(d3.extent(years, function(d) { 
        return parseTime(d); }));
    
    // gets min/max value from each country to set as y 
    y.domain([
    d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
  ]);
    
    // maps colors to z "path"
    z.domain(countries.map(function(c) {return c.countryname; }));
    
    // gives an x axis line and moves it to the bottom
svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // gives number of ticks to y axiss texxt
svg.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(5))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
    
svg.append("text")
    .attr("class", "yScale")
    // if do fron then it goes up
    .style("text-anchor", "end")
    .text("Energy Consumption in Million BTUs")
    // moves it to the left hand side and flips it sideways
    .attr("transform", "translate(" + -50 + "," + height/7 + ") rotate(-90)");
  
    // not my code from 125 to 139
    // this is the grid
      // add the X gridlines
  svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
            // if 0 then only x grids bc thats where it graws from
            // if 100 goes from 0 - 100
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )
    
    var country = svg.selectAll(".country")
    .data(countries)
    .enter().append("g")
      .attr("class", "country");
    
    country.append("text")
    // datum returns the location of where to put city names at, given id and temp position
      .datum(function(d) {
        return {
            // specific country name and their last value
            countryname: d.countryname, 
            value: d.values[d.values.length-1]}; })
      .attr("transform", function(d) {
       // console.log(d.value.value);
        return "translate(" + x(d.value.year) + "," + y(d.value.value) + ")"; })
        // "x" , "dy" moves x/y location of actual text
      .attr("x", 5)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) {
        return d.countryname; });
    
    // code referenced/ borrowed for mouse 165-251
     var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");
    
     mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
    
     var lines = document.getElementsByClassName('line');
    
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(countries)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");
  // the circles with colors called by z
     mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return z(d.countryname);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");
    
    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");
    
     mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
    // getting values of where pointer is and returning it
    .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });
         
         d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            //console.log(width/mouse[0])
            //console.log(d);
            var xDate = x.invert(mouse[0]); 
             // gives date at xPos Jan...2006
            //  console.log(xDate);
            var bisect = d3.bisector(function(d) 
                             { return d.countryname; }).right;
//             console.log(bisect); splits left and right
                var idx = bisect(d.countryname, xDate);
             console.log(idx);
              var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
//
            while (true){
               target = Math.floor((beginning + end) / 2);
              var pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
//    
});
    // adding the path after the mouse stuff allows animations
       country.append("path")
      .attr("class", "line")
     .style("stroke", function(d) { 
           arr[counter] = d.countryname;
           counter++;
           return z(d.countryname); })
      .attr("d", function(d) { return line(d.values); })
//      .style("stroke", function(d) { return z(d.countryname); })
      .call(transition)
    ;
    
    });

// referenced code from 268-278
function transition(path) {
  path.transition()
      .duration(7500)
      .attrTween("stroke-dasharray", tweenDash)
      .each("end", function() { d3.select(this).call(transition); });
}

function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}
//
//
//function checkRadio(input){
//    console.log(document.getElementById(input));
//}
//



