function buildMetadata(site) {
  var metadataSelector = d3.select('#sample-metadata');

  d3.json(`/both_cancer_rates/${site}`).then( data =>{
    metadataSelector.html("");
    console.log(Object.entries(data));
    Object.entries(data).forEach(([key,value]) =>{
      metadataSelector
        .append('p').text(`${key} : ${value}`)
        .append('hr')
    });
    })
}

function barChart(data) {
  let x = ['Male', 'Female'];
  let y = [data.Male_Survival_Rate, data.Female_Survival_Rate];

  let trace =[{
    x: x,
    y: y,
    type: "bar",
    opacity: 0.7,
    marker: {
      color: ['rgba(227, 201, 53, 1)',"rgba(227, 114, 53, 1)"],
    },
  }];

  let layout ={
    plot_bgcolor: "rgb(222, 227, 233)",
    paper_bgcolor: "rgb(222, 227, 233)", 
    title:"<b> Cancer Survival Rate <br> by Gender <br> </b> (2009-2015)",
    xaxis: {
      title: 'Gender',
      tickangle: -45
    },
    yaxis: {
      range: [0,100],
      title: 'Survival Rates (%)'
    },
    showlegend: false,
    bargap :0.1
  };

  Plotly.newPlot('barChart', trace, layout, {responsive: true});
}

function gaugeChart(data) {
// Enter a speed between 0 and 180
let degree = parseInt((data.Survival_per_2009_2015/10)* (180/10));
degree = parseInt(degree / 18) * 18
let level = degree;

// Trig to calc meter point
let degrees = 180-level,
radius = .6;
let radians = degrees * Math.PI / 180;
let x = radius * Math.cos(radians);
let y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
let mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
let path = mainPath.concat(pathX,space,pathY,pathEnd);

let trace = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'Survival Rate (2009-2015)',
    text: data.Survival_per_2009_2015,
    hoverinfo: 'text+name'},
  { values: [100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100/9, 100],
  rotation: 90,
  text: ['90-100', '80-90', '70-80', '60-70', '50-60', '40-50', '30-40', '20-30', '0-10', ''],
  textinfo: 'text',
  textposition:'inside',
  textfont:{
    size : 16,
    },
    marker: {colors:['rgb(150, 255, 0, .5)','rgb(200, 255, 0, .5)',
    'rgb(250, 255, 0, .5)','rgb(255, 250, 0, .5)', 
    'rgb(255, 200, 0, .5)','rgb(255, 150, 0, .5)',
    'rgb(255, 100, 0, .5)','rgb(255, 50, 0, .5)',
    'rgba(150, 0, 0, .5)','rgb(222, 227, 233)']
  },
  labels: ['90-100', '80-90', '70-80', '60-70', '50-60', '40-50', '30-40', '20-30', '0-10', ''],
  hoverinfo: 'text',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

let layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],

  title: '<b> Five Year <br> Cancer Survival Rate (%) </b> <br> (2009-2015)',
  xaxis: {zeroline:false, showticklabels:false,
    showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
    showgrid: false, range: [-1, 1]},
  plot_bgcolor: 'rgb(0, 0, 0, 0)',
  paper_bgcolor: 'rgb(0, 0, 0, 0)',
};
console.log(trace)

Plotly.newPlot('gauge', trace, layout, {responsive: true});
}


function buildCharts(site) {
  d3.json(`/survival_gender/${site}`).then ( sgdata =>
    // ## Gauge Chart ##
    barChart(sgdata)
  );

  d3.json(`/survival/${site}`).then ( sdata =>
    // ## Gauge Chart ##
    gaugeChart(sdata)
  );
 
}

function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json("/sites").then((sampleNames) => {
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();