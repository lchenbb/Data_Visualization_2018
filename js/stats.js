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
	let typicals = data.slice(2, 9);
	let summary = data.slice(9, data.length);
	console.log('summary', summary);
	console.log(data.length);
	let national_data = data[1];
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
		else if (type == 'Summary'){

			show_boxplot(type, summary[0]);
		}
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
		if (type == 'Summary')
			show_boxplot(type, summary.slice(1, summary.length));
		else
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
	    zoomType: 'x',
	    height: (11 / 16 * 100) + '%'
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
	      '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
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

	let flow_type;

	if (d3.select('input[name="myRadios"]:checked').property('value') == 0){
		// boxplot for base flow

		// Define visualize data and visualize type
		flow_type = 'bf';
		v_data = Object.keys(data['value']).map((key, i) => (i, data['value'][key]));
		v_type = 'Baseflow'
	}
	else{
		// Get quick flow type
		qf_type = $('#dropdownListTimeline li a.selected_qf').attr('value');
		qf_index = $('#dropdownListTimeline li a.selected_qf').parent().index();
		flow_type = 'qf';

		// Set up data used in this func
		v_data = data[qf_index];

		v_type = 'Quick flow ' + qf_type;

		if (type == 'Summary'){
			v_data = Object.keys(v_data['value'])
							.map((key, i) => (i, v_data['value'][key]));
		}
		else{
			// Convert data[prov] to array
			let keys = Object.keys(v_data);
			for (let i = 0; i < keys.length; i += 1){
				let key = keys[i];
				v_data[key] = Object.keys(v_data[key]).map((month, i) => (i, v_data[key][month]));
			}
		}
		console.log('data', data);
		console.log('summary data', v_data);
	}

	// Default box plot for whole contury
	Highcharts.chart('boxplot_div', {

	    chart: {
	        type: 'boxplot',
	        height: (11 / 16 * 100) + '%'
	    },

	    title: {
	        text: type + ' ' + v_type
	    },

	    legend: {
	        enabled: false
	    },

	    xAxis: {
	        categories: type == 'Summary' ? PROVINCES : MONTHS,
	        title: {
	            text: type == 'Summary' ? 'Province' : 'Month'
	        }
	    },

		yAxis: (type == 'Summary') ? {min: 0, 
									 plotLines: [{
										value: v_data[14][2],
										color: 'red',
										width: 1,
										label: {
											text: 'National mean: ' + v_data[14][2],
											align: 'center',
											style:{
												color: 'gray'
											}
										}
									}]
		} : {min: 0},
	    series: [{
	        name: 'Observations',
	        // Data are [low, q1, median, q3, high]
	        data: type == 'Summary' ? v_data : v_data[type],
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

	if (type == 'Summary')
		console.log(v_data);
}
// Global variables
var MONTHS = ['Jan', 'Feb', 'Mat', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

var PROVINCES = ['Ayeyarwady', 'Bago', 'Chin', 'Kachin', 'Kayah', 'Kayin', 'Magway',
       'Mandalay', 'Mon', 'Rakhine', 'Sagaing', 'Shan', 'Tanintharyi',
       'Yangon', 'National'];

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

