const numberItems = 7;
//  get set the time format in d3
// use to return month
var formatYearMonth = d3v4.timeFormat("%m %Y");
// use to return in format Jan 2017 which is located under the slider
var formatYearMonth2 = d3v4.timeFormat("%b %Y");

var currentSliderPosition = 12;
var heatmapLayer;
var currentHeatmap = undefined;
var heatmaps = [];
var indexHeatmaps = 1;

// set the data
var startDate = new Date("2018-01-01"), //before the first date of host
    endDate = new Date("2018-12-31"); //after the last date of host

var marginTL = {top:0, right:10, bottom:0, left:10}, //change for the format
    widthTL = 280 - marginTL.left - marginTL.right,
    heightTL = 100 - marginTL.top - marginTL.bottom;

var svgTL = d3v4.select("#vis")
    .append("svg")
    .attr("width", widthTL + marginTL.left + marginTL.right)
    .attr("height", heightTL + marginTL.top + marginTL.bottom);

////////// slider //////////
var moving = false;
var currentValue = 0;
var targetValue = widthTL;

var playButton = d3v4.select("#play-button");

var x = d3v4.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

var slider = svgTL.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + marginTL.left + "," + 40 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3v4.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          currentValue = d3v4.event.x;
          update(x.invert(currentValue));
        })
    );
  x_ticks = x.ticks(4);
  x_ticks.unshift(startDate);

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 25 + ")")
  .selectAll("text")
    .data(x_ticks) //number of ticks
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 0) // distance of tick to the slider
    .attr("text-anchor", "right")
    .text(function(d) { return formatYearMonth2(d).split(" ")[0]; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 8)
    .attr("cx", widthTL);

var label = slider.append("text")
    .attr("class", "label")
    .attr("style", "font-size:10px")
    .attr("text-anchor", "middle")
    .text(formatYearMonth2(endDate).split(" ")[0])
    .attr("transform", "translate(0," + (-15) + ")") // position of label
    .attr("x", widthTL);

////////// play //////////

// var plot = svg.append("g")
//     .attr("class", "plot")
//     .attr("transform", "translate(" + marginTL.left + "," + marginTL.top + ")");

d3v4.csv(prepare, function(data) {
  playButton
    .on("click", function() {
    var button = d3v4.select(this);
    if (button.text() == "Pause") {
      moving = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      moving = true;
      timer = setInterval(step, 50);
      button.text("Pause");
    }
    console.log("Slider moving: " + moving);
  })
})

function prepare(d) {
  d.id = d.id;
  d.date = parseDate(d.date);
  return d;
}

function step() {
  // console.log(currentValue);
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue/151);
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

function update(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label.attr("x", x(h))
       .text(formatYearMonth2(h).split(" ")[0]);
  var month = formatYearMonth(h).split(" ")[0];
  var year = formatYearMonth(h).split(" ")[1];
  console.log(month);
  currentSliderPosition = parseInt(month, 10);
  showHeatMap(parseInt(month,10));
  // There should update a function here to show the heatmap
}

function showHeatMap(index) {
  if(currentHeatmap !== undefined) {
    map.removeLayer(currentHeatmap);
  }

  let heatmap = L.heatLayer(eval(getVariableNameHeatmap(index)), {
    radius:10,
    max:860,
  }).addTo(map);
  currentHeatmap = heatmap;
  heatmapLayer = heatmap;
  return heatmap;
}

function Switch(x){
  var selected = document.getElementById(x).value;
  switch(true) {
    case(selected == "heatmap"):
      heatmap.set('opacity', 0.8);
      for (var circle in circles) {
        circles[circle].setMap(null);
      }
      for (var bubble in bubbles) {
        bubbles[bubble].setMap(null);
      }
      currentDisplay = "heatmap"
      break;
    case(selected == "circles"):
      heatmap.set('opacity', 0);
      for (var circle in circles) {
        circles[circle].setMap(map);
      }
      for (var bubble in bubbles) {
        bubbles[bubble].setMap(null);
      }
      currentDisplay = "circles"
      break;
    case(selected == "bubbles"):
      heatmap.set('opacity', 0);
      for (var circle in circles) {
        circles[circle].setMap(null);
      }
      for (var bubble in bubbles) {
        bubbles[bubble].setMap(map);
      }
      currentDisplay = "bubbles"
  }

}

function Reset() {
  handle.attr("cx", widthTL);
  label
    .attr("x", widthTL)
    .text(formatYearMonth2(endDate));
    currentValue = 0;
    moving = false;
    // console.log(currentValue);

    console.log(formatYearMonth(endDate).split(" ")[0]);
  // more detailed needed to implement
}

function setDropdownTimeline(value) {
  $(".dropdown").find('#dropdownSearchTimeline').html(value + ' <span class="caret"></span>');
  $(".dropdown").find('#dropdownSearchTimeline').val(value);
}

function setListenersDropdownTimeline() {
  $("#timeline-item1").click(function(e){
    loadTimelineData(1);
  });

  $("#timeline-item2").click(function(e){
    loadTimelineData(2);
  });

  $("#timeline-item3").click(function(e){
    loadTimelineData(3);
  });

  $("#timeline-item4").click(function(e){
    loadTimelineData(4);
  });

  $("#timeline-item5").click(function(e){
    loadTimelineData(5);
  });

  $("#timeline-item6").click(function(e){
    loadTimelineData(6);
  });

  $("#timeline-item7").click(function(e){
    loadTimelineData(7);
  });
}

function loadTimelineData(index) {
  $.getScript(getPathFromIndex(index), function(data, textStatus, jqxhr) {
    console.log("Load was performed with index: " + index);
    indexHeatmaps = index;
  });
}

function getPathFromIndex(index) {
  let path = "";
  switch(index) {
    case 1:
      path = "data/qf_historical_12months/qf_historical_12months.js";
      break;
    case 2:
      path = "data/qfData/rcp45_2020_25pct.js"
      break;
    case 3:
      path = "data/qfData/rcp45_2020_25pct_allag.js"
      break;
    case 4:
      path = "data/qfData/rcp45_2040_25pct.js";
      break;
    case 5:
      path = "data/qfData/rcp45_2040_25pct_allag.js";
      break;
    case 6:
      path = "data/qfData/rcp85_2020_75pct.js";
      break;
    case 7:
      path = "data/qfData/rcp85_2040_75pct.js";
      break;
    default:
  }
  return path;
}

function getVariableNameHeatmap(index) {
  console.log(indexHeatmaps);
  var varName = "";
  switch(indexHeatmaps) {
    case 1:
      varName = "qf_" + index;
      break;
    case 2:
      varName = "qf_" + index + "_rcp45_2020_25pct";
      break;
    case 3:
      varName = "qf_" + index + "_rcp45_2020_25pct_allag";
      break;
    case 4:
      varName = "qf_" + index + "_rcp45_2040_25pct";
      break;
    case 5:
      varName = "qf_" + index + "_rcp45_2040_25pct_allag";
      break;
    case 6:
      varName = "qf_" + index + "_rcp85_2020_75pct";
      break;
    case 7:
      varName = "qf_" + index + "_rcp85_2040_75pct";
      break;
    default:
  }
  return varName;
}

function hideTimelineElements() {
  $("#timelineElements").hide();
}

function showTimelineElements() {
  $("#timelineElements").show();
}
