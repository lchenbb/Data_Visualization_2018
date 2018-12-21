function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

function show_stats(type, data){

	// Seperate data
	let provinces_data = data[0];
	console.log('provincial data', provinces_data);
	let typicals = data[1];
	let national_data = data[2];
	console.log('typicals', typicals);
	console.log(d3.select("input[name='myRadios']:checked").property('value'));
	// Choose statistical elements division
	let stat_elements_div = d3.select('#stat_elements_div');

	// Remove old info
	stat_elements_div.selectAll('*').remove();

	// Show baseflow statistics
	if (d3.select('input[name="myRadios"]:checked').property('value') == 0){
		if (type == 'National')
			// Visualize summary
			show_hist('National', national_data);
		else{
			// Visualize provincial data
			let provincial_data = {bins: provinces_data['bins'][type],
									 values: provinces_data['full_disc_data_counts'][type]};
			
			show_hist(type, provincial_data);
		}
	}

	// Show quick flow statistics
	if (d3.select('input[name="myRadios"]:checked').property('value') == 1){
		// Show chart if input value is qf
		show_boxplot(type, typicals);

	}
}


function show_hist(type, data){

	// Get division to plot in 
	let stat_elements_div = d3.select('#stat_elements_div');

	// Show histogram if input value if base flow

	// Create div to enable histogram
	let hist_div = stat_elements_div.append('div')
										.attr('id', 'hist_div');
	console.log(Object.keys(data['bins']).map((key, i) => (i, data['bins'][key])));
	let hist = Highcharts.chart('hist_div', {
	  chart: {
	    type: 'column',
	    zoomType: 'x'
	  },
	  title: {
	    text: type + ' baseflow distribution'
	  },
	  subtitle: {
	    text: ''
	  },
	  xAxis: {
	    categories: Object.keys(data['bins']).map((key, i) => (i, data['bins'][key])),
	    title: {
	    	text: 'Baseflow'
	    },
	    tickInterval: 1,
	    crosshair: true
	  },
	  yAxis: {
	    min: 0,
	    title: {
	      text: 'Number of sample points'
	    }
	  },
	  tooltip: {
	    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	      '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
	    footerFormat: '</table>',
	    shared: true,
	    useHTML: true
	  },
	  plotOptions: {
	    column: {
	      pointPadding: 0,
	      borderWidth: 0.5,
	      groupPadding: 0,
	      shadow: false
	    }
	  },
	  series: [{
	  	showInLegend: false,
	    data: Object.keys(data['values']).map((key, i) => (i, data['values'][key]))

	  }]
	});

	hist.xAxis[0].setExtremes(20, 60);
	hist.showResetZoom();
}


function show_boxplot(type, data){

	// Display quick flow info

	// Get division to plot
	let stat_elements_div = d3.select('#stat_elements_div');

	let boxplot_div = stat_elements_div.append('div')
										.attr('id', 'boxplot_div');
										
	// Set up data used in this func
	typicals = data;

	// Convert data[prov] to array
	let keys = Object.keys(typicals);
	for (let i = 0; i < keys.length; i += 1){
		let key = keys[i];
		typicals[key] = Object.keys(typicals[key]).map((month, i) => (i, typicals[key][month]));
	}

	let provs = Object.keys(typicals);

	// Default box plot for whole contury
	Highcharts.chart('boxplot_div', {

	    chart: {
	        type: 'boxplot'
	    },

	    title: {
	        text: type + ' Quick Flow per Month '
	    },

	    legend: {
	        enabled: false
	    },

	    xAxis: {
	        categories: MONTHS,
	        title: {
	            text: 'Month'
	        }
	    },

	    series: [{
	        name: 'Observations',
	        // Data are [low, q1, median, q3, high]
	        data: typicals[type],
	        tooltip: {
	            headerFormat: '<em>Quick flow {point.key}</em><br/>'
	        }
	    }, {
	        name: 'Outlier',
	        color: Highcharts.getOptions().colors[0],
	        type: 'scatter',
	        marker: {
	            fillColor: 'white',
	            lineWidth: 1,
	            lineColor: Highcharts.getOptions().colors[0]
	        },
	        tooltip: {
	            pointFormat: 'Observation: {point.y}'
	        }
	    }]

	});
}
// Global variables
var MONTHS = ['Jan', 'Feb', 'Mat', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


function test(){
	console.log('load stats');
}
whenDocumentLoaded(() => {

	let name = d3.select('#radio2')
					.attr('name');

	// Get typicals data
	let typicals = d3.json('./data/monthly_qf/typical_provs.json');

	// Get national baseflow data
	let national_data = d3.json('./data/national_data.json');
	// Add event listener to quick flow
	/*
	Promise.all([typicals, national_data]).then(data => {

		d3.selectAll("input[name='myRadios']")
			.on('change', function(){
				show_stats(this, data);
			});
		}
	);
	*/
})

