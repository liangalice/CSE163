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

    //Define Color -- office hours
    var colors = d3.scaleOrdinal(d3.schemeSet3);

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
    
    //Get Data
    // parses into retrievable values
    // received modification/help from OH
    d3.csv("scatterdata.csv").then(function(data) {
        var scatterdataset = data.map(function(data){
        return{
            name: data.country,
            country: data.country,
            gdp: +data.gdp,
            epc: +data.ecc,
            population: data.population,
            total: +(data.ec)                           
         }});

    //Define Scales   
    var xScale = d3.scaleLinear()
        .range([0, width])

    var yScale = d3.scaleLinear()
        .range([height, 0])

    // Define domain for xScale and yScale
    // values are being added to have correct values for display
    xScale.domain([(0),d3.max(scatterdataset,function(d){
        return d.gdp+2
    })])
    // values are being added to have correct values for display
    yScale.domain([d3.min(scatterdataset, function(d) { return d.epc;})-20, d3.max(scatterdataset, function(d) { return d.epc;})+35]);
        
    //Define Axis
    var xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);
    
    //clip
    // gives an id that can be referenced later
    svg.append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

     
       //  define a rect that is the "boundaries"
      svg.append("rect")  
        .attr("height",height)
        .attr("width",width)
        .style("fill","none")
        .style("pointer-events","all")
        .attr("transform","translate('+ margin.left +','+margin.top+')");
        
        // keePTrack, everything that I want within the axis gets appended here
        var keepTrack = svg.append("g")
            .attr("transform","translate('+ margin.left +','+margin.top+')")
            .attr('clip-path', 'url(#clip)')
            .classed("keepTrack",true);
    
    //Draw Scatterplot        
    // called from keepTrack because this keeps it within the axis
    // adds a circle
    // sizing specific to country ( equation referenced from book)
    // location(x,y) depends on value of gdp and epc
    // colors specific to country
    var  dotAll= keepTrack.selectAll("circle").data(data);
    dotAll = dotAll.data(scatterdataset)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", function(d){return .2*Math.sqrt(d.epc*d.population)})
    .attr("cx", function(d) {return xScale(d.gdp);})
    .attr("cy", function(d) {return yScale(d.epc);})
    .style("fill", function (d) { return colors(d.country); })

    //Add .on("mouseover", .....
    .on("mouseover",function(d){
    //Add Tooltip.html with transition and style
        /*
          var totalText = ( d.country + "<br>"  
                      + "Population  :"+d.population + " Million" + "<br>" 
                      + "GDP  :"  +" "  + d.gdp + " Trillion"+ "<br>"
                      + "ECC : "  + " " + d.epc + "Million BTUs" +"<br>"
                      + "Total :" + " "+ d.total + "Trillion BTUs" );*/
    
    // this text gets aligned correctly using html format of tables
    // attribute values and strings are added 
       var text =
        '<table width="100%" height="100%><tr style="text-align:center"><th colspan="2">' + d.country
        +  '</th></tr><tr><td width="50%" style="text-align:left">'
        +  'Population</td><td style= "text-align:right">' + d.population + ' Million' + '</td></tr><tr><td style="text-align:left">'
        +  'GDP</td><td style= "text-align:right">' + d.gdp + ' Trillion' + '</td></tr><tr><td style="text-align:left">'
        +  'EPC</td><td style= "text-align:right">' + d.epc + ' Million BTUs' + '</td></tr><tr><td style="text-align:left">'
        +  'Total</td><td style= "text-align:right">' + d.total + ' Trillion BTUs' + '</td></tr></table>'
     
    // referenced code
    d3.select("#tooltip")
    .html(text.bold()) // puts text into viewable form and turns into bold
    .transition()
    .duration(1) // 1 is instant 
    .style("left", (d3.event.pageX + 15) + "px") // style determines where the tooltip goes
    .style("top", (d3.event.pageY - 28) + "px")
    .style("opacity", 1) // makes it visible
    // this is the actual tooltip box beind displayed
    d3.select("#tooltip").classed("hidden", false);})
        
        
    //Then Add .on("mouseout", ....
    // when mouse leaves
    // referenced code, not used...
    .on("mouseout",function(d){
            tooltip.transition()
            .duration(500) // split sec
            .style("opacity", 0);//   hides it
        })
        
    //Sets the text according to country
    // text location is aligned with the gdp and epc values
    // called from keepTrack because this keeps it within the axis
    var dotText =keepTrack.selectAll(".text")
    .data(scatterdataset)
    .enter().append("text")
    .attr("class","text")
    .style("text-anchor", "start")
    .attr("x", function(d) {return xScale(d.gdp);})
    .attr("y", function(d) {return yScale(d.epc);})
    .style("fill", "black")
    .text(function (d) {return d.name; });
    
    //x-axis
    // text gets added to x axis
    // x/y positions adjusted by hard coded values
   var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        svg.append("text")
        .attr("class", "label")
        .attr("y", 450)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010")
        .attr("fill","black");

    //Y-axis
    // text gets added to y axis
    // x/y positions of axis adjusted by hard coded values
    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        
        svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
    
    // for lines 188-240
    // keepTrack is used because this keeps it within the axis
    // used for each legend individually (for both text and circles)
    // box
   var legend =  keepTrack.append("rect")
        .attr("x",495)
        .attr("y",160)
        .attr("width",240)
        .attr("height",227)
        .style("fill","gray");
        
    // big circle
   var legend2 =
    keepTrack.append("circle")
        .attr("r",.2*Math.sqrt(100000))
        .attr("cx", 660)
        .attr("cy", 300)
        .style("fill", "white");
    var legend3 =
    keepTrack.append("text")
        .attr("x",495)
        .attr("y",300)
        .text("100 Trillion BTUs");
        
    // med circle
    var legend4 =
    keepTrack.append("circle")
        .attr("r",.2*Math.sqrt(10000))
        .attr("cx", 660)
        .attr("cy", 210)
        .style("fill", "white");
    var legend5 =
    keepTrack.append("text")
        .attr("x",500)
        .attr("y",220)
        .text("10 Trillion BTUs");
    // small circle
    var legend6 =
    keepTrack.append("circle")
        .attr("r",.2*Math.sqrt(1000))
        .attr("cx", 660)
        .attr("cy", 180)
        .style("fill", "white");
    var legend7 =
    keepTrack.append("text")
        .attr("x",501)
        .attr("y",185)
        .text("1 Trillion BTUs");
        
    // Total Energy Consumption
    var legend8 =
     keepTrack.append("text")
        .attr("x",505)
        .attr("y",380)
        .attr("font-size", "19px")
        .attr("fill","green")
        .text("Total Energy Consumption");
        
    // Zoom is referenced
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
        dotAll.attr("transform", d3.event.transform);  // all countries
        dotText.attr("transform", d3.event.transform); // all the text for each country
        legend.attr("transform", d3.event.transform);  // the gray box of legend
        legend2.attr("transform", d3.event.transform); // largest circle of legend
        legend3.attr("transform", d3.event.transform); // text for largest circle of legend
        legend4.attr("transform", d3.event.transform); // med sized circle of legend
        legend5.attr("transform", d3.event.transform); // text for med sized legend
        legend6.attr("transform", d3.event.transform); // small circle of legend
        legend7.attr("transform", d3.event.transform); // text for smallest circle of legend
        legend8.attr("transform", d3.event.transform); // text for total consumption
        // rescales accordingly
        gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
     }
        
    // a button that resets view when clicked
    // referenced code, slightly modified 
    d3.selectAll("button")
            .on("click", function resetted() 
            {
                svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
            })
        var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

var myColor = d3.scaleLinear().domain([1,10])
  .range(["white", "blue"])
svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 50).attr("r", 19).attr("fill", function(d){return myColor(d) })
})