<?php echo Erdiko::getView(2, 'd3/map-nav.php'); ?>

<h3>Map with tooltips</h3>

<div id="map"></div>

<script>
    var m_width = $("#map").width(),
        width = 938,
        height = 500,
        country,
        state;

    var projection = d3.geo.mercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", country_clicked);

    var g = svg.append("g");

    // Tooltip example
    var tooltip = d3.select("body")
      .append("div")
      .style("color", "#FFF")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");

    d3.json("d3/geo/countries.topo.json", function(error, us) {
      g.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.countries).features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.id; })
        .attr("d", path)
        .on("click", country_clicked);
    });

    function zoom(xyz) {
      g.transition()
        .duration(750)
        .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
        .selectAll(["#countries", "#states", "#cities"])
        .style("stroke-width", 1.0 / xyz[2] + "px")
        .selectAll(".city")
        .attr("d", path.pointRadius(20.0 / xyz[2]));


    }

    function get_xyz(d) {
      var bounds = path.bounds(d);
      var w_scale = (bounds[1][0] - bounds[0][0]) / width;
      var h_scale = (bounds[1][1] - bounds[0][1]) / height;
      var z = .96 / Math.max(w_scale, h_scale);
      var x = (bounds[1][0] + bounds[0][0]) / 2;
      var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
      return [x, y, z];
    }

    function country_clicked(d) {
      g.selectAll(["#states", "#cities"]).remove();
      state = null;

      if (country) {
        g.selectAll("#" + country.id).style('display', null);
      }

      if (d && country !== d) {
        var xyz = get_xyz(d);
        country = d;

        if (d.id  == 'USA' || d.id == 'JPN') {
          d3.json("d3/geo/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
            g.append("g")
              .attr("id", "states")
              .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
              .enter()
              .append("path")
              .attr("id", function(d) { return d.id; })
              .attr("class", "active")
              .attr("d", path)
              .on("click", state_clicked);

            zoom(xyz);
            g.selectAll("#" + d.id).style('display', 'none');
          });      
        } else {
          zoom(xyz);
        }
      } else {
        var xyz = [width / 2, height / 1.5, 1];
        country = null;
        zoom(xyz);
      }
    }

    function state_clicked(d) {
      g.selectAll("#cities").remove();

      if (d && state !== d) {
        var xyz = get_xyz(d);
        state = d;

        country_code = state.id.substring(0, 3).toLowerCase();
        state_name = state.properties.name;

        d3.json("d3/geo/cities_" + country_code + ".topo.json", function(error, us) {

          // debug data
          console.log(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }));

          g.append("g")
            .attr("id", "cities")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
            .enter()
            .append("path")
            .attr("id", function(d) { return d.properties.name; })
            .attr("class", "city")
            .attr("d", path.pointRadius(20 / xyz[2]))
            // .append("svg:title")
            .text(function(d) { return d.properties.name; })
            .on("mouseover", function(d){
              tooltip.text(d.properties.name);
              return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

          zoom(xyz);
        });      
      } else {
        state = null;
        country_clicked(country);
      }
    }

    $(window).resize(function() {
      var w = $("#map").width();
      svg.attr("width", w);
      svg.attr("height", w * height / width);
    });
</script>

Map code borrowed from <a href="http://www.tnoda.com/blog/2013-12-07">tnoda.com</a>
