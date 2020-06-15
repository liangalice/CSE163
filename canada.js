/*global window, console, d3 */
/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.----------------------------------------------------------------------------*/ 
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

    //Define Margin
    var margin = {left: 100, right: 50, top: 150, bottom: 50 }, 
        width = 800 + margin.left -margin.right ,
        height = 1200 - margin.top - margin.bottom;

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 //Define Tooltip here for Density
     var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);
// Tooltip for Temperature
var tooltip2 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);

// color for population density (in green)
var color = d3.scaleQuantize()
.range(["rgb(237,248,233)", "rgb(186,228,179)",
                   "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

// color for population density (in pink)
var colorTemp = d3.scaleQuantize()
.range([
    "rgb(255,243,243)", "rgb(255,224,224)", "rgb(255,204,204)","rgb(255,184,184)", "rgb(255,150,150)",]);


// map "spherical polygonal geometry to planar polygonal geometry"
var projection = d3.geoMercator()
    .center([-100,75])
    .scale([500]);

// puts into projection
var path = d3.geoPath().projection(projection)

// temp variables that gets changed accordingly when checking for density/temperature
var densityColor;
var tempColor;

// variable to check if button is clicked
var changeToTemp = 0;

// color legend for population density km^2
 var legend =  svg.append("rect")
 // min is 0 max is 8.5
        .attr("x",-75)
        .attr("y",700)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(237,248,233)");

    svg.append("text")
        .attr("x",-20)
        .attr("y",725)
        .attr("font-size", "10px")
        .text("0 - 8.5");

svg.append("rect")
// min is 9.1 max is 16.7
 .attr("x",-75)
        .attr("y",750)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(186,228,179)");

svg.append("text")
        .attr("x",-20)
        .attr("y",775)
        .attr("font-size", "10px")
        .text("8.5 - 16.7");

svg.append("rect")
// min is 17.4  max 25.8
 .attr("x",-75)
        .attr("y",800)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(116,196,118)");

svg.append("text")
        .attr("x",-20)
        .attr("y",825)
        .attr("font-size", "10px")
        .text("16.7 - 25.8");

svg.append("rect")
// min is 26.6 max is 34.6
 .attr("x",-75)
        .attr("y",850)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(49,163,84)");


svg.append("text")
        .attr("x",-20)
        .attr("y",875)
        .attr("font-size", "10px")
        .text("25.8 - 34.6");


svg.append("rect")
// min is 34.7 max is 4334.4
 .attr("x",-75)
        .attr("y",900)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(0,109,44)");

svg.append("text")
        .attr("x",-20)
        .attr("y",925)
        .attr("font-size", "10px")
        .text("34.6 - 4334.4");

svg.append("text")
    .attr("x",-75)
    .attr("y",680)
    .text("pop density per km^2 ")

// color legend for difference in temperature (high-low) farenheit
// temperature is in pink
 var tempLegend =  
svg.append("rect")
 .attr("x",-75)
        .attr("y",350)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(255,243,243)");
svg.append("text")
        .attr("x",-20)
        .attr("y",375)
        .attr("font-size", "10px")
        .text("0 - 15");

svg.append("rect")
 .attr("x",-75)
        .attr("y",400)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(255,224,224)");
svg.append("text")
        .attr("x",-20)
        .attr("y",425)
        .attr("font-size", "10px")
        .text("15 - 20");

svg.append("rect")
 .attr("x",-75)
        .attr("y",450)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(255,204,204)")
svg.append("text")
        .attr("x",-20)
        .attr("y",475)
        .attr("font-size", "10px")
        .text("20 - 25");

 svg.append("rect")
        .attr("x",-75)
        .attr("y",500)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(255,184,184)");
svg.append("text")
        .attr("x",-20)
        .attr("y",525)
        .attr("font-size", "10px")
        .text("25 - 30");

svg.append("rect")
 .attr("x",-75)
        .attr("y",550)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(255,165,165)");
svg.append("text")
        .attr("x",-20)
        .attr("y",575)
        .attr("font-size", "10px")
        .text("> 30");


svg.append("text")
    .attr("x",-75)
    .attr("y",330)
    .text("change in temp F")
 /////////////////////////////////////////////////////////////////////////////////////
// parsing in data
d3.csv("canada.csv").then(function(data) 
{
    var scatterdataset = data.map(function(data)
    {
        return{
            name: data["Geographic name"],
            geographicCode: data["Geographic code"],
            density: +data["Population density per square kilometre, 2016"],
            highTemp: +data["Average July High Temp F"],
            lowTemp: +data["Average July Low Temp F"]
         }});
    // sets max/min density as color range
    color.domain(
    [
        d3.min(scatterdataset, function(d) { return d.density; }), d3.max(scatterdataset, function(d) { return d.density; })
    ]);
var counter = 0;
    d3.json("gadm36_CAN_2.json").then(function(json)
    {
        var features = json.features;    
        features.forEach(function(feature)
        {   
            // checks what type of geo and maps accordingly
            if(feature.geometry.type == "MultiPolygon")
            {
                feature.geometry.coordinates.forEach(function(polygon){
                    polygon.forEach(function(ring){
                        ring.reverse();
                    })
                })
            }
            else if( feature.geometry.type == "Polygon")
            {
                feature.geometry.coordinates.forEach(function(ring){
                    ring.reverse();
                })
            }
        })
        
  // merge data
        for(var i = 0 ; i < data.length ; i++ )
        {
            // iterating through csv and getting name/density/temp
            var dataName = data[i]["Geographic name"];
            var dataDensity = data[i]["Population density per square kilometre, 2016"];
            var dataLowTemp = data[i]["Average July Low Temp F"];
            var dataHighTemp = data[i]["Average July High Temp F"];
            for(var j = 0 ; j < json.features.length ; j++)
            {
                // iterating through json and getting name
                var jsonName = json.features[j].properties["NAME_2"]
                if(dataName == jsonName)
                {
                    // adding density,highTemp,lowTemp into jsonfile from csv
                    counter++;
                    json.features[j].properties["population density"] = dataDensity;
                    json.features[j].properties["Average July High Temp F"] = dataHighTemp;
                    json.features[j].properties["Average July Low Temp F"] = dataLowTemp;
//                    console.log(json.features[j].properties["population density"]);
                }
            }
        }

// check if button is clicked
    d3.selectAll("button")
        .on("click", function resetted() 
        {
            // removes previous drawn graph and tooltip so new one can be used/drawn
            d3.selectAll("#popGraph").remove();
            d3.selectAll("#tooltip").remove();
            changeToTemp = 5;
            if(changeToTemp == 5)
            {
                // redraw/initalize  
                 svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                 .attr("id", function(d){
                        return d.properties["NAME_2"]})
                        .on("mouseover",function(d){    
                     //gets high and low temp for inside tooltip
                var text =
        '<table width="100%" height="100%><tr style="text-align:center"><th colspan="2">' + d.properties["NAME_2"]
        +  '</th></tr><tr><td width="50%" style="text-align:left">'
        +  'High temp</td><td style= "text-align:right">'  + d.properties["Average July High Temp F"] + '</td></tr><tr><td style="text-align:left">'
        +  'Low temp</td><td style= "text-align:right">'  +  d.properties["Average July Low Temp F"]  + '</td></tr><tr><td style="text-align:left">'
//        +  'Pop density</td><td style= "text-align:right">'  + d.properties["population density"]  + '</td></tr><tr><td style="text-align:left">'
             
            d3.select("#tooltip2")
            .html(text.bold()) // puts text into viewable form and turns into bold
            .transition()
            .duration(.1) // 1 is instant 
            .style("left", (d3.event.pageX ) + "px") // style determines where the tooltip goes
            .style("top", (d3.event.pageY ) + "px")
            .style("opacity", 1) // makes it visible
            .attr("font-size", "5px")
            // this is the actual tooltip box beind displayed
            d3.select("#tooltip2").classed("hidden", false);})
        .on("mouseout",function(d){
            tooltip2.transition()
            .duration(10) // split sec
            .style("opacity", 0);//   hides it
        })
                .style("fill", function(json) 
                {
                    // checks the delta temp and sets accordingly for pink color
                    var checkTempHigh = json.properties["Average July High Temp F"];
                     var checkTempLow = json.properties["Average July Low Temp F"];
                     var diff = checkTempHigh - checkTempLow;
                     if(diff)
                     {
                         if(diff > 0 && diff <=15)
                         {
                            tempColor = "rgb(255,243,243)";
                            return tempColor;
                         }
                        if(diff > 15 && diff < 20)
                        {  
                            tempColor = "rgb(255,224,224)"; 
                            return tempColor;
                        }
                        else if (diff >= 20 && diff < 25)
                        { 
                            tempColor = "rgb(255,204,204)";
                            return tempColor;
                        }
                        else
                        {
                            tempColor = "rgb(255,150,150)";
                            return tempColor;
                        }
                     }
                    else
                    {
                        // if not initalized then white it is
                          return "#FFFFFF";   
                     }
                } 
                      );
            }            
    });

        console.log(counter); // check num times that csv=json
    var map =   svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d){
            return d.properties["NAME_2"]})
        .attr("id", "popGraph")
        .on("mouseover",function(d){            
              var text =
        '<table width="100%" height="100%><tr style="text-align:center"><th colspan="2">' + d.properties["NAME_2"]
        +  '</th></tr><tr><td width="50%" style="text-align:left">'
        +  'Pop density</td><td style= "text-align:right">'  + d.properties["population density"]  + '</td></tr><tr><td style="text-align:left">'
             // green tooltip for density
            d3.select("#tooltip")
            .html(text.bold()) // puts text into viewable form and turns into bold
            .transition()
            .duration(.1) // 1 is instant 
            .style("left", (d3.event.pageX ) + "px") // style determines where the tooltip goes
            .style("top", (d3.event.pageY ) + "px")
            .style("opacity", 1) // makes it visible
            // this is the actual tooltip box beind displayed
            d3.select("#tooltip").classed("hidden", false);})
        .on("mouseout",function(d){
            tooltip.transition()
            .duration(10) // split sec
            .style("opacity", 0);//   hides it
        })  
        .style("fill", function(json) 
        {
            // checks if density is valid and return its color
            var checkDensity = json.properties["population density"];
                if(checkDensity)
                {
                    densityColor = color(checkDensity*100);
                    return densityColor;
                }
                else
                {
                  return "#FFFFFF";
                }
        }
    );

/////////////////////////////////////////////////////////////////////////////////////

        // zoom only for population
            var zoom = d3.zoom()
    .scaleExtent([0.5, 40])
    // top left , bottom right
    .translateExtent([[-400, -400], [width + 90, height + 100]])
    .on("zoom", zoomed);
     svg.call(zoom);
     function zoomed() 
    {
        map.attr("transform", d3.event.transform); 
     }
});
});


