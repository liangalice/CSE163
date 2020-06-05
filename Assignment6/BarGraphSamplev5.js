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

//The margins are how much space it is from the left/right/top/bottom
var margin = {top: 10, right: 40, bottom: 150, left: 80},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together. 
// Add comments here in your own words to explain this segment of code

// I think this says if there is none defined, there is this default value

// it defines svg as a reference to this function that adds attributes width height 
// transform shifts the margin by  "margin.left" val, "margin.top" val in the plane
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below

// determines the scale size
// x padding (0.1) == larger width 0.9 = smaller width
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var yScale = d3.scaleLinear().range([height, 0]);


// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign

var xAxis = d3.axisBottom(xScale);
// set interval aka ticks to 5 on x axis
var yAxis = d3.axisLeft(yScale).ticks(5);
// using tickFormat to insert $
yAxis.tickFormat(d3.format("$"));


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// You must provide comments here to demonstrate your understanding of these commands

// changed keys and values to country and gdp
// have to set countery to be a country from data
function rowConverter(data) {
    return {
        country : data.country,
        gdp : +data.gdp
    }
}

d3.csv("GDP2020TrillionUSDollars.csv",rowConverter).then(function(data){
    
    // change key --> country
    // change value --> gdp 
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    
    // sets the data's range to all the data inputs
    // so xScale range is from the countries
    // yScale range is from gdp
    xScale.domain(data.map(function(d){ return d.country; }));
    yScale.domain([0,d3.max(data, function(d) {return d.gdp; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below
    
    // creates the bars and defines the width and length
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .transition().duration(1000) // larger number makes it slower
        .delay(function(d,i) {return i * 200;}) // delay is how long it takes to display drawed bars
        
        // this returns the width by taking number of countries
        .attr("x", function(d) 
        {
            // xScale is defined 0 - width
            return xScale(d.country);
        })
        // this determines where the y bar is
        // removing this will have the values flipped upside down
        .attr("y", function(d) 
        {
            return yScale(d.gdp);
        })
        .attr("width", xScale.bandwidth())
        // determines the values of the bar's actual height
        .attr("height", function(d) 
        {	
            return height- yScale(d.gdp);
        })
       
        // create increasing to decreasing shade of blue as shown on the output
    
        // takes in the bar's values and determines the color for each bar
        .attr("fill", function(d,i)
        {
            return "rgb(0, 0, " + Math.round((i * 30) + 120) + ")";
        });	 
    
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        // Label the data values(d.value)
        // get gdp and country
        .text(function(d)
        {
            return d.gdp;
        }) 
        // corresponds x with country
        .attr("x",function(d)
        {
            return xScale(d.country);
        })
        .attr("y",function(d)
        {
            // puts the value of the gdp inside the bar correctly in height
            return height - (d.gdp * 15) + 11;
        })
        .attr("fill","white");
        
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        // moves the x axis down to intersect with y axis
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")        
        .selectAll("text")
        .attr("font-size", "10px")
        // rotates the words to -60 degrees
        .attr("transform","rotate(-60)");
    
    // yAxis  
    // have to append then 
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
    
    // This is where the Trillions of US Dollars ($) gets added
    svg.append("text")
    .attr("class", "yScale")
    .style("text-anchor", "end")
    .text("Trillions of US Dollars ($)")
    // moves it to the left hand side and flips it sideways
    .attr("transform", "translate(" + -55 + "," + height/4 + ") rotate(-90)");
     
});
