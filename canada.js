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

    //Define Color -- office hours
//    var colors = d3.scaleOrdinal(d3.schemeSet3);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 //Define Tooltip here
     var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);

var color = d3.scaleQuantize()
.range(["rgb(237,248,233)", "rgb(186,228,179)",
                   "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

var projection = d3.geoMercator()
    .center([-100,75])
    .scale([500]);

var path = d3.geoPath().projection(projection)

var densityColor;


 var legend =  svg.append("rect")
        .attr("x",0)
        .attr("y",100)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(237,248,233)");

svg.append("rect")
 .attr("x",0)
        .attr("y",150)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(186,228,179)");

svg.append("rect")
 .attr("x",0)
        .attr("y",200)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(116,196,118)");
svg.append("rect")
 .attr("x",0)
        .attr("y",250)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(49,163,84)");

svg.append("rect")
 .attr("x",0)
        .attr("y",300)
        .attr("width",50)
        .attr("height",50)
        .style("fill","rgb(0,109,44)");



    
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
            var dataName = data[i]["Geographic name"];
            var dataDensity = data[i]["Population density per square kilometre, 2016"];
            var dataLowTemp = data[i]["Average July Low Temp F"];
            var dataHighTemp = data[i]["Average July High Temp F"];
            for(var j = 0 ; j < json.features.length ; j++)
            {
                var jsonName = json.features[j].properties["NAME_2"]
                if(dataName == jsonName)
                {
                //    console.log(dataName);
//                    console.log(dataLowTemp);
//                    console.log(dataHighTemp);
                    counter++;
                    json.features[j].properties["population density"] = dataDensity;
                    json.features[j].properties["Average July High Temp F"] = dataHighTemp;
                    json.features[j].properties["Average July Low Temp F"] = dataLowTemp;
//                    console.log(json.features[j].properties["population density"]);
                }
//                else {
//                    console.log(jsonName);
//        
//                }
            }
        }
        console.log(counter);
    var map =   svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function(d){
            return d.properties["NAME_2"]})
        // dont delete bc it works
        .on("mouseover",function(d){

//            console.log(d.properties);
//            console.log(d.properties["Average July High Temp F"])
//            console.log(d.properties["Average July Low Temp F"])
//     
            
              var text =
        '<table width="100%" height="100%><tr style="text-align:center"><th colspan="2">' + d.properties["NAME_2"]
        +  '</th></tr><tr><td width="50%" style="text-align:left">'
        +  'High temp</td><td style= "text-align:right">'  + d.properties["Average July High Temp F"] + '</td></tr><tr><td style="text-align:left">'
        +  'Low temp</td><td style= "text-align:right">'  +  d.properties["Average July Low Temp F"]  + '</td></tr><tr><td style="text-align:left">'
        +  'Pop density</td><td style= "text-align:right">'  + d.properties["population density"]  + '</td></tr><tr><td style="text-align:left">'
             
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
////           
        .style("fill", function(json) {
            var checkDensity = json.properties["population density"];
            if (checkDensity) 
            {
                densityColor = color(checkDensity*100);
                console.log(densityColor);
                return densityColor;
            } else {
                console.log(json.properties["NAME_2"]);
                return "#FFFFFF";
            }
        }
    );
    
    var zoom = d3.zoom()
    .scaleExtent([0.5, 40])
    // top left , bottom right
    .translateExtent([[-400, -400], [width + 90, height + 100]])
    .on("zoom", zoomed);
         
    // Define zoom
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
     svg.call(zoom);
     function zoomed() {
        // calling d3.event.transform takes into account of what also
        // needs to be zoomed, 
     
        map.attr("transform", d3.event.transform); // text for total consumption
   
     }
            // a button that resets view when clicked
    // referenced code, slightly modified 
    d3.selectAll("button")
            .on("click", function resetted() 
            {
            console.log("clicked");
                svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
            })
//
//       
//        
    });
//    
//  
//
//    
//    
//     
//    
//    
    });


