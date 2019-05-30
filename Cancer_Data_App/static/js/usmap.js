Plotly.d3.csv('db/cancer2017.csv', function(err, rows){
    function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
    }
   
    var data = [{
      type: 'choropleth',
      locationmode: 'USA-states',
      locations: unpack(rows, 'Postal'),
      z: unpack(rows, 'Rate'),
      text: unpack(rows, 'State'),
      autocolorscale: true
    }];
   
    var layout = {
      title: 'Cancer Mortality by State: 2017',
      geo:{
        scope: 'usa',
        countrycolor: 'rgb(255, 255, 255)',
        showland: true,
        landcolor: 'rgb(217, 217, 217)',
        showlakes: true,
        lakecolor: 'rgb(255, 255, 255)',
        subunitcolor: 'rgb(255, 255, 255)',
        lonaxis: {},
        lataxis: {}
      }
    };
    Plotly.plot('mapid', data, layout, {showLink: false});
   });