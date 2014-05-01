<?php echo Erdiko::getView(4, 'd3/chart-nav.php'); ?>

<h3>Bitcoin Value Over Time</h3>
<p>Green shows a day of positive trading, red denotes negitive</p>

<svg class="chart"></svg>

<script>

var width = 960,
    height = 500;

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

d3.csv("d3/bitcoin-data.csv", type, function(error, data) {
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d.close); })
      .attr("height", function(d) { return height - y(d.close); })
      .attr("width", barWidth - 1)
      .attr("class",function(d) {
      	if(d.close > d.open){
      		return "positive";
      	} else {
      		return "negative";
      	}
      });     

  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.close) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.close; });
});

// x-axis
chart.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width - 900)
    .attr("y", height + 20)
    .text("Time");

// y-axis label like this
chart.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -90)
    .attr("y", -20)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Bitcoin Closing Price in $USD");

function type(d) {
  d.close = +d.close; // coerce to number
  return d;
}
</script>