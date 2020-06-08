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
        width = 1500 - margin.left -margin.right,
        height = 1500 - margin.top - margin.bottom;


    //Define Tooltip here
     var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("pointer-events", "none")
        .style("opacity", 0);
    
var color = d3.scaleQuantize()
.range(["rgb(237,248,233)", "rgb(186,228,179)",
                   "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);

    //Define Color -- office hours
    var colors = d3.scaleOrdinal(d3.schemeSet3);
    var parseTime = d3.timeParse("%Y");
    //Define SVG
    var nameArr = [];
    var yearArr =[];
    var co2Arr = [];
var counter = 0;
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //  x line
    svg.append("line")
    .attr("x1",80)
    .attr("y1",400)
    .attr("x2",1050)
    .attr("y2",400)
    .attr("stroke-width",2)
    .attr("stroke","black");
    // y line
    svg.append("line")
    .attr("x1",80)
    .attr("y1",-10)
    .attr("x2",80)
    .attr("y2",400)
    .attr("stroke-width",2)
    .attr("stroke","black");

     d3.csv("pop.csv").then(function(data) 
     {
        var years = data.columns.slice(2);
        var countries = data.map(function (row){
            return{
                // puts the real Country Name into country name 
                countryname: row["Country Name"],
                population: years.map(function(year)
                {
                    return{
                        year: parseTime(year),pop: +row[year]};
                }),
            };
        });
        d3.csv("emission.csv").then(function(data2){
            var emName ;
            var emYear;
            var emCO2;
            var currYearDen = 0.0;
            var counter = 1999;
            var numYears = [1999,2000,2001,2002,2003,2004,2005,2006,2007,
                            2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];
            // console.log(data[j]["Country Name"]);
            // console.log("year is" + data2[i].Year);
            // console.log("CO2 is" + data2[i]["Per capita CO₂ emissions (tonnes per capita)"]);
            // console.log("pop is" + data[j][data2[i].Year] );
            //  console.log("density is" + (data[j][data2[i].Year]/data2[i]["Per capita CO₂ emissions (tonnes per capita)"]) );

             for(let i = 0 ; i < data2.length ; i++){
                for(let j = 0 ; j< data.length ; j++){
                    if(data[j]["Country Name"] == data2[i].Entity){
                        var currYear = data2[i].Year;
                        var den = (parseFloat(data2[i]["Per capita CO₂ emissions (tonnes per capita)"])  );

                        //
                        if(den > 10){
                            den = den-4;
                        }


                    svg.selectAll("myline")
                        .data(data)
                      .enter()
                      .append("line")
                        .attr("x1", (80))
                        .attr("x2", (80))
                        .attr("y1", function(d) { return (30*j) ;})
                        .attr("y2", function(d) { return (30*j);})
                        .attr("stroke", "grey")
                        .transition()
                        .ease(d3.easeLinear)  
                        .duration(8000)
                        .attr("x2", function(d) { return 1000; })
                        .attr("id","lollipopLine");


                        var easeLinear = svg.append("circle")
                        .attr("fill", "powderblue")
                        .attr("id", "popGraph")
                        easeLinear
                        .attr('cx', 80)          
                        .attr('cy', (30*j)) 
                        .transition()   

                        .attr("r",den ) 


                        .ease(d3.easeLinear)           // control speed of the transition
                        .duration(8000)           // 4000 milliseconds

                        .attr('cx', 1000);       // move to 720 on x axis


                        // document.getElementById("minValue").innerHTML = den;
                        
                        var easeLinear = svg.append("text")
                        .attr("id","popTextY")
                        .attr("dy", ".35em") 
                        .attr("x", 0)
                        .attr("text-anchor", "middle") 
                        .attr("y", (30*j))
                        .text(data[j]["Country Name"]);



                    }
                }
            }
            // console.log(data);
            for(let k = 0 ; k < 19 ; k++){
                // console.log(data[k]["Country Name"]);
                // console.log(data2[2]);
                var easeLinear = svg.append("text")
                .attr("id","popTextX")
                .attr("dx", ".35em") 
                .attr("x", 100+(50*k))
                .attr("text-anchor", "middle") 
                .attr("y", 425)
                .text(numYears[k]);
            }
            var currButtonName = document.getElementById("changeClick").innerHTML;
            var checkFirstClick = 0;
            d3.selectAll("button")
                .on("click", function resetted() 
                {

                    // first time clicking 
                    if(checkFirstClick == 0)
                    {
                        document.getElementById("titleID").innerHTML = "World Population 1999 -> 2018";
                        document.getElementById("changeClick").innerHTML = "Population";
                        d3.selectAll("#popGraph").remove();
                        d3.selectAll("#popTextY").remove();
                        d3.selectAll("#lollipopLine").remove();
                        for(let i = 0 ; i < data2.length ; i++)
                        {
                            for(let j = 0 ; j< data.length ; j++)
                            {
                                if(data[j]["Country Name"] == data2[i].Entity)
                                {
                                    svg.selectAll("myline")
                                    .data(data)
                                  .enter()
                                  .append("line")
                                    .attr("x1", (80))
                                    .attr("x2", (80))
                                    .attr("y1", function(d) { return (30*j) ;})
                                    .attr("y2", function(d) { return (30*j);})
                                    .attr("stroke", "grey")
                                    .transition()
                                    .ease(d3.easeLinear)  
                                    .duration(8000)
                                    .attr("x2", function(d) { return 1000; })
                                    .attr("id","lollipopLine");
                                    var pop = 0;                        
                                    pop = (data[j][data2[i].Year]);
                                    if(pop > 0 && pop <= 9999999){
                                        pop = pop/2000000;
                                    }
                                    else if(pop > 9999999 && pop <= 99999999){
                                        pop = pop/9400000;
                                    }
                                    else if(pop > 99999999 && pop <= 999999999){
                                        pop = pop/33000000;
                                    }
                                    else{
                                            pop = pop/90000000;
                                    }
                                    var easeLinear = svg.append("circle")
                                    .attr("fill", "pink")
                                    easeLinear
                                    .attr('cx', 90)          
                                    .attr('cy', (30*j))
                                    .attr('id',"pinkGraph") 
                                    .transition()   
                                    .attr("r",pop)        
                                    .ease(d3.easeLinear)           // control speed of the transition
                                    .duration(8000)           // 4000 milliseconds
                                    .attr('cx', 1000)   ;       // move to 720 on x axis
                                    var len = data[j]["Country Name"].toString().length;

                                    var easeLinear = svg.append("text")
                                    .attr("dy", ".35em") 
                                    .attr("x", 0 )
                                    .attr("text-anchor", "middle") 
                                    .attr("y", 30*j)
                                    .text(data[j]["Country Name"]);

                                           svg.selectAll("myline")

                                }           
                            }
                        }
                    }
                    // after first click
                    checkFirstClick++;
                    // every click after first
                    if(checkFirstClick>1)
                    {
                        if(document.getElementById("changeClick").innerHTML == "Emissions")
                        {
                            document.getElementById("titleID").innerHTML = "World Population 1999 -> 2018";
                            d3.selectAll("#popGraph").remove();
                            d3.selectAll("#popTextY").remove();
                            d3.selectAll("#lollipopLine").remove();
                            for(let i = 0 ; i < data2.length ; i++)
                            {
                                for(let j = 0 ; j< data.length ; j++)
                                {
                                    if(data[j]["Country Name"] == data2[i].Entity)
                                    {

                                        svg.selectAll("myline")
                                        .data(data)
                                      .enter()
                                      .append("line")
                                        .attr("x1", (80))
                                        .attr("x2", (80))
                                        .attr("y1", function(d) { return (30*j) ;})
                                        .attr("y2", function(d) { return (30*j);})
                                        .attr("stroke", "grey")
                                        .transition()
                                        .ease(d3.easeLinear)  
                                        .duration(8000)
                                        .attr("x2", function(d) { return 1000; })
                                        .attr("id","lollipopLine");
                                        var pop = 0;
                                        pop = (data[j][data2[i].Year]);
                                        if(pop > 0 && pop <= 9999999){
                                                pop = pop/2000000;
                                        }
                                        else if(pop > 9999999 && pop <= 99999999){
                                            pop = pop/9400000;
                                        }
                                        else if(pop > 99999999 && pop <= 999999999){
                                            pop = pop/33000000;
                                        }
                                        else{
                                            pop = pop/90000000;
                                        }
                                        var easeLinear = svg.append("circle")
                                        .attr("fill", "pink")
                                        easeLinear
                                        .attr('cx', 90)          
                                        .attr('cy', (30*j))
                                        .attr('id',"pinkGraph") 
                                        .transition()   
                                        .attr("r",pop)        
                                        .ease(d3.easeLinear)           // control speed of the transition
                                        .duration(8000)           // 4000 milliseconds
                                        .attr('cx', 1000)   ;       // move to 720 on x axis
                                        var len = data[j]["Country Name"].toString().length;

                                        var easeLinear = svg.append("text")
                                        .attr("dy", ".35em") 
                                        .attr("x", 0 )
                                        .attr("text-anchor", "middle") 
                                        .attr("y", 30*j)
                                        .text(data[j]["Country Name"]);
                                    }           
                                }
                            }
                            // change button name
                            document.getElementById("changeClick").innerHTML = "Population";
                        }
                        else
                        {
                            document.getElementById("titleID").innerHTML = "World CO₂ Emissions Per Capita 1999 -> 2018";
                            // get rid of prev drawing
                            d3.selectAll("#pinkGraph").remove();
                            d3.selectAll("#lollipopLine").remove();
                            for(let i = 0 ; i < data2.length ; i++){
                                for(let j = 0 ; j< data.length ; j++){
                                    if(data[j]["Country Name"] == data2[i].Entity){

                                        svg.selectAll("myline")
                                        .data(data)
                                      .enter()
                                      .append("line")
                                        .attr("x1", (80))
                                        .attr("x2", (80))
                                        .attr("y1", function(d) { return (30*j) ;})
                                        .attr("y2", function(d) { return (30*j);})
                                        .attr("stroke", "grey")
                                        .transition()
                                        .ease(d3.easeLinear)  
                                        .duration(8000)
                                        .attr("x2", function(d) { return 1000; })
                                        .attr("id","lollipopLine");


                                        var currYear = data2[i].Year;
                                        var den = (parseFloat(data2[i]["Per capita CO₂ emissions (tonnes per capita)"])  );
                                        if(den > 10){
                                            den = den-4;
                                        }
                                        var easeLinear = svg.append("circle")
                                        .attr("fill", "powderblue")
                                        .attr("id", "popGraph")
                                        easeLinear
                                        .attr('cx', 90)          
                                        .attr('cy', (30*j)) 
                                        .transition()   
                                        .attr("r",den )        
                                        .ease(d3.easeLinear)           // control speed of the transition
                                        .duration(8000)           // 4000 milliseconds
                                        .attr('cx', 1000)   ;       // move to 720 on x axis
                                        // y axis
                                        var easeLinear = svg.append("text")
                                        .attr("id","popTextY")
                                        .attr("dy", ".35em") 
                                        .attr("x", 0)
                                        .attr("text-anchor", "middle") 
                                        .attr("y", (30*j))
                                        .text(data[j]["Country Name"]);
                                    }
                                }
                            }         
                            document.getElementById("changeClick").innerHTML = "Emissions";
                        }
                    }                        
                });
                });
        });

function changeName(){
    d3.selectAll("#miniature").remove();
    d3.csv("pop.csv").then(function(data) 
    {
        var years = data.columns.slice(2);
        var countries = data.map(function (row){
            return{
                // puts the real Country Name into country name 
                countryname: row["Country Name"],
                population: years.map(function(year)
                {
                    return{
                        year: parseTime(year),pop: +row[year]};
                }),
            };
        });
        var xPos = 100;
        d3.csv("emission.csv").then(function(data2)
        {
            var currCountry = document.getElementById("type").value;
            for(let i = 0 ; i < data2.length; i++){
                for(let j = 0; j < data.length ;j++){
                    if((data[j]["Country Name"] == data2[i].Entity) && (data[j]["Country Name"] == currCountry)){
                        xPos = xPos + 100;
                        var easeLinear = svg.selectAll("circle")
                        .data(data2)
                        .enter().append("circle")
                        .attr("fill", function(data2){
                            var colors = d3.scaleOrdinal(d3.schemeSet3);
                            if(data2.Entity == currCountry)
                            {

                            var curr = color(parseFloat(data2["Per capita CO₂ emissions (tonnes per capita)"]));}
                            return curr;
                        })
                        .attr("id", "miniature")
                        .attr("cx", function(xPos) 
                        { 
                            return parseInt((xPos.Year-2000)*50); 
                        })
                        .attr("cy",700)
                        .attr("r", function(data2) 
                        { 
                            // console.log(data2.Entity == currCountry);
                            if(data2.Entity == currCountry)
                            {

                            var curr = (parseFloat(data2["Per capita CO₂ emissions (tonnes per capita)"]));
                            return curr ;}
                        })
                        .on("mouseover",function(d){
                             var text =
        '<table width="100%" height="100%><tr style="text-align:center"><th colspan="2">' + d.Entity
        +  '</th></tr><tr><td width="50%" style="text-align:left">'
        +  'Year</td><td style= "text-align:right">' + d.Year  + '</td></tr><tr><td style="text-align:left">'
        +  'Per capita CO₂ emissions (tonnes per capita)</td><td style= "text-align:right">' + d["Per capita CO₂ emissions (tonnes per capita)"]  + '</td></tr><tr><td style="text-align:left">'
        '</td></tr></table>'


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
    
                    }
        
               } }

            })
    });





  }