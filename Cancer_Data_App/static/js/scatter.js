// Bubble Chart
// var g_xScale;
// var g_csvData;
let scatterAcord = d3.select("#headingTwo2")

scatterAcord.on("click", function(){
    d3.select("#scatter").selectAll("svg").remove()
    scatter()})
async function scatter() {

  //setting up the margins and chartwidth
   const svgWidth = 960;
   const svgHeight = 600;

   const margin = {
       top: 50,
       right: 10,
       bottom: 50,
       left: 80
   };

   const height = svgHeight - margin.top - margin.bottom;
   const width = svgWidth - margin.left - margin.right;
   // console.log(height)
   // console.log(width)

   // data
//    const csvData = await d3.csv("both_cancer_rates.csv")

   const csvData = await d3.json("/both_cancer_rates_all")
   csvData.forEach(d=>{
       d.Site = d.Site
       d.Estimated_NewCases_2019 = d.Estimated_NewCases_2019/100
       d.Survival_per_2009_2015 = d.Survival_per_2009_2015

   })
   console.log(csvData)
   g_csvData = csvData;

  //colors for the circle from color scale
  var color = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#e6beff', '#000000','#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231','#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1',]
  
//    append svg and group
   const svg = d3.select("#scatter")
       .append("svg")
       .attr("height", svgHeight)
       .attr("width", svgWidth)
//    for glow start
       var defs = svg.append("defs");

       //Filter for the outside glow
       var filter = defs.append("filter")
           .attr("id","glow");
       filter.append("feGaussianBlur")
           .attr("stdDeviation","3.5")
           .attr("result","coloredBlur");
       var feMerge = filter.append("feMerge");
       feMerge.append("feMergeNode")
           .attr("in","coloredBlur");
       feMerge.append("feMergeNode")
           .attr("in","SourceGraphic");
    //   for glow end 

   const chartGroup = svg.append("g")
       .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // scales
   const xScale = d3.scaleBand()
          .domain(csvData.map(d => d.Site))
          .range([0, width])
          .padding(0.1);
    g_xScale = xScale;


   const yScale = d3.scaleLinear()
               .domain([0, d3.max(csvData, d=>d.Estimated_NewCases_2019)])
               .range([height, 0]);


//    // Create axis functions
//    // ==============================
   const bottomAxis = d3.axisBottom()
                        .scale(xScale)
                        .ticks(28)
   const leftAxis = d3.axisLeft(yScale)

//    // Append Axes to the chart
//    // ==============================
   chartGroup.append("g")
            .call(leftAxis)
           

   chartGroup.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(bottomAxis)
       .selectAll("text")	
       .style("text-anchor", "end")
       .attr("dx", "-.8em")
       .attr("dy", ".15em")
       .attr("transform", function(d) {
           return "rotate(-65)" 
           });

   // append circles to data points
   const circlesGroup = chartGroup.selectAll("circle")
   .data(csvData)
   .enter()
   .append("circle")
    .attr("opacity","0.5")
    .attr("stroke","black") 
    //for glow
    .attr("class","classOfCircles")
    //Apply glow to your circles
d3.selectAll(".classOfCircles")
.style("filter", "url(#glow)");

// Initialize tool tip
// ==============================
   const toolTip = d3.tip()
       .attr("class", "d3-tip")
       .offset([0, 0])
       .html(function(d) {
       return (`<strong>${d.Site}</strong><br><strong>Survival (2009-2015): ${d.Survival_per_2009_2015}%</strong><br><strong>Estimated New Cases: ${d.Estimated_NewCases_2019}</strong>`);
       });

// //   Add an onmouseover event to display a tooltip
// //     // ========================================================
   chartGroup.call(toolTip);

//  Create event listeners to display and hide the tooltip
//     // ==============================
   circlesGroup.on("click", function(d) {
           toolTip.show(d, this)
           d3.select(this)
        //    circlesGroup.transition()
         
           .attr('r', d=> d.Survival_per_2009_2015/5*2+29)        
       })
        
       .on("mouseout", function(d) {
       toolTip.hide(d)
       circlesGroup.transition()
       .attr('r', d=> d.Survival_per_2009_2015/5*2)
       .duration(700) 
       })
     
    
//      Create axes labels
   chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left-4)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
   
       .style("fill", "black")
       .text("Estimated New Cases (2019)");

   circlesGroup.transition()
               .duration(3000)
               .attr("cx", (d,i) => xScale(d.Site))
               .attr("cy", d => yScale(d.Estimated_NewCases_2019))
               .attr('r', d=> d.Survival_per_2009_2015/5*2)
                .style('fill', function(d,i){ 
                    return color[i]})
                .duration(2500)
                .ease(d3.easeBounce)


}
