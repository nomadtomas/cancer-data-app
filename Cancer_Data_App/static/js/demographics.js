const margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.json("/demo_data", function(error, data){
        console.log(d3.json("/demo_data"))
    // demoData.forEach(d=>{
    //     d.female_death_num = d.female_death_num
    //     d.female_new_num = d.female_death_num
    //     d.female_pct_deaths = d.female_pct_deaths
     
    // })
    // console.log(demoData)
    // g_demoData = demoData;    
	// // filter year
	// let data = data.filter(function(d){return d.Year == '2012';});
	// // Get every column value
	// let elements = Object.keys(data[0])
	// 	.filter(function(d){
	// 		return ((d != "Year") & (d != "State"));
	// 	});
	// const selection = elements[0];

	// let y = d3.scale.linear()
	// 		.domain([0, d3.max(data, function(d){
	// 			return +d[selection];
	// 		})])
	// 		.range([height, 0]);

	// let x = d3.scale.ordinal()
	// 		.domain(data.map(function(d){ return d.State;}))
	// 		.rangeBands([0, width]);


	// let xAxis = d3.svg.axis()
	// 	.scale(x)
	//     .orient("bottom");

	// let yAxis = d3.svg.axis()
	// 	.scale(y)
	//     .orient("left");

	// svg.append("g")
    // 	.attr("class", "x axis")
    // 	.attr("transform", "translate(0," + height + ")")
    // 	.call(xAxis)
    // 	.selectAll("text")
    // 	.style("font-size", "8px")
    //   	.style("text-anchor", "end")
    //   	.attr("dx", "-.8em")
    //   	.attr("dy", "-.55em")
    //   	.attr("transform", "rotate(-90)" );


 	// svg.append("g")
    // 	.attr("class", "y axis")
    // 	.call(yAxis);

	// svg.selectAll("rectangle")
	// 	.data(data)
	// 	.enter()
	// 	.append("rect")
	// 	.attr("class","rectangle")
	// 	.attr("width", width/data.length)
	// 	.attr("height", function(d){
	// 		return height - y(+d[selection]);
	// 	})
	// 	.attr("x", function(d, i){
	// 		return (width / data.length) * i ;
	// 	})
	// 	.attr("y", function(d){
	// 		return y(+d[selection]);
	// 	})
	// 	.append("title")
	// 	.text(function(d){
	// 		return d.State + " : " + d[selection];
	// 	});

	// const selector = d3.select("#drop")
    // 	.append("select")
    // 	.attr("id","dropdown")
    // 	.on("change", function(d){
    //     	selection = document.getElementById("dropdown");

    //     	y.domain([0, d3.max(data, function(d){
	// 			return +d[selection.value];})]);

    //     	yAxis.scale(y);

    //     	d3.selectAll(".rectangle")
    //        		.transition()
	//             .attr("height", function(d){
	// 				return height - y(+d[selection.value]);
	// 			})
	// 			.attr("x", function(d, i){
	// 				return (width / data.length) * i ;
	// 			})
	// 			.attr("y", function(d){
	// 				return y(+d[selection.value]);
	// 			})
    //        		.ease("linear")
    //        		.select("title")
    //        		.text(function(d){
    //        			return d.State + " : " + d[selection.value];
    //        		});
      
    //        	d3.selectAll("g.y.axis")
    //        		.transition()
    //        		.call(yAxis);

    //      });

    // selector.selectAll("option")
    //   .data(elements)
    //   .enter().append("option")
    //   .attr("value", function(d){
    //     return d;
    //   })
    //   .text(function(d){
    //     return d;
    //   })


});