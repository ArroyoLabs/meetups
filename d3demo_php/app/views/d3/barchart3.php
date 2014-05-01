<?php echo Erdiko::getView(3, 'd3/chart-nav.php'); ?>

<h3>Includes X & Y Axis Labels</h3>

<svg class="chart"></svg>

<script>

var width = 960,
    height = 500;

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

d3.tsv("d3/barchart2-data.tsv", type, function(error, data) {
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  var barWidth = width / data.length;

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.value) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });
});

// x-axis
chart.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width - 820)
    .attr("y", height + 20)
    .text("This is the X Axis");

// y-axis label like this
chart.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -60)
    .attr("y", -20)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("This is the Y Axis");

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
</script>