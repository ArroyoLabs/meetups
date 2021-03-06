// Create a new collection: Foods
Foods = new Meteor.Collection("foods");

if (Meteor.isClient) {

    /*
    Iron Router Setup
    */
    Router.configure({
        layoutTemplate: "layout"
    });

    Router.map(function() {
        this.route("index", {
            path: "/",
            template: "index"
        });

        this.route("bars1", {
            path: "/bars1",
            template: "bars1"
        });

        this.route("bars2", {
            path: "/bars2",
            template: "bars2"
        });

        this.route("bars3", {
            path: "/bars3",
            template: "bars3"
        });

        this.route("bars4", {
            path: "/bars4",
            template: "bars4"
        });

        this.route("maps1", {
            path: "/maps1",
            template: "map1"
        });

        this.route("maps2", {
            path: "/maps2",
            template: "map2"
        });

        this.route("maps3", {
            path: "/maps3",
            template: "map3"
        });

        this.route("maps4", {
            path: "/maps4",
            template: "map4"
        });

        this.route("maps5", {
            path: "/maps5",
            template: "map5"
        });

        this.route("linegraph", {
            path: "/linegraph",
            template: "linegraph1"
        });

        this.route("reactivebars", {
            path: "/reactivebars",
            template: "reactivebars"
        });
    });

    // Get a list of the foods and sort by name
    Template.foodlist.foods = function () {
        return Foods.find({}, {sort: {name: 1}});
    };

    // Get Selected food and display it in the 'details' div
    Template.foodlist.selected_food = function () {
        var food = Foods.findOne(Session.get("selected_food"));
        return food && food.name;
    };

    // Return CSS class selected if this food is the chosen/selected one
    Template.food.selected = function () {
        return Session.equals("selected_food", this._id) ? "selected" : '';
    };

    // foodlist specific events
    Template.foodlist.events({

        // Vote for a selected food when we click the button
        'click input.inc': function () {
            Foods.update(Session.get("selected_food"), {$inc: {votes: 1}});
        }

    });

    // food template specific events
    Template.food.events({

        // Select a food when we click on the name
        'click': function () {
            Session.set("selected_food", this._id);
        }

    });

    /* 
        D3 Template Helpers

        This is where the magic happens: We set up an SVG based chart
        from the food vote data, and make it reactive.

        D3 is a 'client only' library, it really has no business being in
        the backend since it only manipulates the data from the backend.

    */
    Template.bars1.created = function () {

        _.defer(function () {

            var m = [30, 10, 10, 30],
                w = 960 - m[1] - m[3],
                h = 930 - m[0] - m[2];

            var format = d3.format(",.0f");

            var x = d3.scale.linear().range([0, w]),
                y = d3.scale.ordinal().rangeRoundBands([0, h], .1);

            var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h),
                yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

            var svg = d3.select("#chart1").append("svg")
                    .attr("width", w + m[1] + m[3])
                    .attr("height", h + m[0] + m[2])
                .append("g")
                    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            d3.csv("data/barchart-sample-data.csv", function(data) {

                // Parse numbers, and sort by value.
                data.forEach(function(d) { d.value = +d.value; });
                data.sort(function(a, b) { return b.value - a.value; });

                // Set the scale domain.
                x.domain([0, d3.max(data, function(d) { return d.value; })]);
                y.domain(data.map(function(d) { return d.name; }));

                var bar = svg.selectAll("g.bar")
                    .data(data)
                .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

                bar.append("rect")
                    .attr("width", function(d) { return x(d.value); })
                    .attr("height", y.rangeBand());

                bar.append("text")
                    .attr("class", "value")
                    .attr("x", function(d) { return x(d.value); })
                    .attr("y", y.rangeBand() / 2)
                    .attr("dx", -3)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .text(function(d) { return format(d.value); });

                svg.append("g")
                    .attr("class", "x axis")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);
            });
        });

    }

    Template.bars2.created = function() {

        _.defer(function () {

            var width = 960,
                height = 500;

            var y = d3.scale.linear()
                .range([height, 0]);

            var chart = d3.select("#chart2")
                .attr("width", width)
                .attr("height", height);

            d3.tsv("data/barchart2-data.tsv", type, function(error, data) {
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

            function type(d) {
                d.value = +d.value; // coerce to number
                return d;
            }

        });
    }

    Template.bars3.created = function() {

        _.defer(function () {

            var width = 960,
                height = 500;

            var y = d3.scale.linear()
                .range([height, 0]);

            var chart = d3.select("#chart3")
                .attr("width", width)
                .attr("height", height);

            d3.tsv("data/barchart2-data.tsv", type, function(error, data) {
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

        });

    }

    Template.bars4.created = function() {

        _.defer(function () {

            var width = 960,
                height = 500;

            var y = d3.scale.linear()
                .range([height, 0]);

            var chart = d3.select("#chart4")
                .attr("width", width)
                .attr("height", height);

            // Tooltip example
            var tooltip = d3.select("body")
              .append("div")
              .attr("class", "tooltip2")
              .style("position", "absolute")
              .text("a tooltip");

            d3.csv("data/bitcoin-data.csv", type, function(error, data) {
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
                    })
                    .on("mouseover", function(d){
                        n = d.close;
                        tooltip.text("Closing Price: $"+n.toFixed(2));
                        return tooltip.style("display", "block");
                    })
                    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                    .on("mouseout", function(){return tooltip.style("display", "none");});
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

        });
    }

    Template.map1.created = function() {

        _.defer(function () {

            var m_width = $("#map1").width(),
                width = 938,
                height = 500,
                country,
                state;

            var projection = d3.geo.mercator()
                .scale(150)
                .translate([width / 2, height / 1.5]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#map1").append("svg")
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

            d3.json("data/geo/countries.topo.json", function(error, us) {
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
                  d3.json("data/geo/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
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

                d3.json("data/geo/cities_" + country_code + ".topo.json", function(error, us) {
                  g.append("g")
                    .attr("id", "cities")
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
                    .enter()
                    .append("path")
                    .attr("id", function(d) { return d.properties.name; })
                    .attr("class", "city")
                    .attr("d", path.pointRadius(20 / xyz[2]));

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

        });

    }

    Template.map2.created = function() {

        _.defer(function () {

            var m_width = $("#map2").width(),
                width = 938,
                height = 500,
                country,
                state;

            var projection = d3.geo.mercator()
                .scale(150)
                .translate([width / 2, height / 1.5]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#map2").append("svg")
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

            // Create div that will hold tooltip
            var tooltip = d3.select("body")
                .append("div")
                .style("color", "#FFF")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .text("a simple tooltip");

            d3.json("data/geo/countries.topo.json", function(error, us) {
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
                        d3.json("data/geo/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
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

                    d3.json("data/geo/cities_" + country_code + ".topo.json", function(error, us) {

                        // Attach mouseover, mouseout and mousemove events to the data point
                        g.append("g")
                            .attr("id", "cities")
                            .selectAll("path")
                            .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
                            .enter()
                            .append("path")
                            .attr("id", function(d) { return d.properties.name; })
                            .attr("class", "city")
                            .attr("d", path.pointRadius(20 / xyz[2]))
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
                var w = $("#map2").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        });

    }

    Template.map3.created = function() {

        _.defer(function () {

            var m_width = $("#map3").width(),
                width = 938,
                height = 500,
                country,
                state;

            var projection = d3.geo.mercator()
                .scale(150)
                .translate([width / 2, height / 1.5]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#map3").append("svg")
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

            var tooltip = d3.select("body")
                .append("div")
                .style("color", "#FFF")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .text("a simple tooltip");

            d3.json("data/geo/countries.topo.json", function(error, us) {
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
                        d3.json("data/geo/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
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

                    var file = "data/geo/cities_test.json"; // testing the format
                    file = "data/earthques-all_week.geo.json"; // local copy of http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

                    d3.json(file,function(error, us) {
                        g.append("g")
                            .attr("id", "cities")
                            .selectAll("path")
                            .data(us)
                            .enter()
                            .append("path")
                            .attr("id", function(d) { return d.properties.time; })
                            .attr("class", "city")
                            .attr("d", path.pointRadius(20 / xyz[2]))
                            .text(function(d) { return d.properties.title; })
                            .on("mouseover", function(d){
                                tooltip.text(d.properties.title);
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

            function state_clicked_old(d) {
                g.selectAll("#cities").remove();

                if (d && state !== d) {
                    var xyz = get_xyz(d);
                    state = d;

                    country_code = state.id.substring(0, 3).toLowerCase();
                    state_name = state.properties.name;

                    d3.json("data/geo/cities_" + country_code + ".topo.json", function(error, us) {

                        g.append("g")
                            .attr("id", "cities")
                            .selectAll("path")
                            .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
                            .enter()
                            .append("path")
                            .attr("id", function(d) { return d.properties.name; })
                            .attr("class", "city")
                            .attr("d", path.pointRadius(20 / xyz[2]))
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
                var w = $("#map3").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        });

    }

    Template.map4.created = function() {

        _.defer(function () {

            var m_width = $("#map4").width(),
                width = 938,
                height = 500,
                country,
                state;

            var projection = d3.geo.mercator()
                .scale(150)
                .translate([width / 2, height / 1.5]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#map4").append("svg")
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

            d3.json("data/geo/countries.topo.json", function(error, us) {
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
                    .selectAll(".city");
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
                        d3.json("data/geo/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
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
                    var file = "data/earthques-all_week.geo.json"; // local copy of http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

                    d3.json(file,function(error, us) {
                        var den = xyz[2];
                        g.append("g")
                            .attr("id", "cities")
                            .selectAll("path")
                            .data(us)
                            .enter()
                            .append("path")
                            .attr("id", function(d) { return d.properties.time; })
                            .attr("class", function(d){
                                mag = Math.round(d.properties.mag);
                                return "city mag-"+mag;
                            })
                            .attr("d", path.pointRadius( function(d) { 
                                return (2*d.properties.mag/10);
                            } ))
                            .on("mouseover", function(d){
                                tooltip.text(d.properties.title);
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

            function state_clicked_original(d) {
                g.selectAll("#cities").remove();

                if (d && state !== d) {
                    var xyz = get_xyz(d);
                    state = d;

                    country_code = state.id.substring(0, 3).toLowerCase();
                    state_name = state.properties.name;

                    d3.json("data/geo/cities_" + country_code + ".topo.json", function(error, us) {
                        g.append("g")
                        .attr("id", "cities")
                        .selectAll("path")
                        .data(topojson.feature(us, us.objects.cities).features.filter(function(d) { return state_name == d.properties.state; }))
                        .enter()
                        .append("path")
                        .attr("id", function(d) { return d.properties.name; })
                        .attr("class", "city")
                        .attr("d", path.pointRadius(20 / xyz[2]))
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
                var w = $("#map4").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        });

    }

    Template.map5.created = function() {

        _.defer(function () {

            var m_width = $("#map5").width(),
                width = 938,
                height = 500,
                country,
                state;

            var projection = d3.geo.mercator()
                .scale(150)
                .translate([width / 2, height / 1.5]);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#map5").append("svg")
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
              .attr("class", "tooltip2")
              .style("position", "absolute")
              .text("a tooltip");

            d3.json("data/geo/countries.topo.json", function(error, us) {
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

            plotEarthquakes(3);

            function zoom(xyz) {
                g.transition()
                    .duration(750)
                    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
                    .selectAll(["#countries", "#states", "#cities"])
                    .style("stroke-width", 1.0 / xyz[2] + "px")
                    .selectAll(".city");
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
                        d3.json("data/geo/states_" + d.id.toLowerCase() + ".topo.json", function(error, us) {
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

                            plotEarthquakes(1.5);
                        });      
                    } else {
                        zoom(xyz);
                        plotEarthquakes(1.5);
                    }
                } else {
                    var xyz = [width / 2, height / 1.5, 1];
                    country = null;
                    zoom(xyz);
                    plotEarthquakes(1.5);
                }
            }

            function plotEarthquakes(scaleFactor) {
                var file = "data/earthques-all_week.geo.json"; // local copy of http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
                d3.json(file,function(error, us) {

                    g.append("g")
                        .attr("id", "cities")
                        .selectAll("path")
                        .data(us)
                        .enter()
                        .append("path")
                        .attr("id", function(d) { return d.properties.time; })
                        .attr("class", function(d){
                            mag = Math.round(d.properties.mag);
                            return "city mag-"+mag;
                        })
                        .attr("d", path.pointRadius( function(d) { 
                            return ((d.properties.mag/10)*scaleFactor);
                        } ))
                        .on("mouseover", function(d){
                            tooltip.text(d.properties.title);
                            return tooltip.style("display", "block");
                        })
                        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                        .on("mouseout", function(){return tooltip.style("display", "none");});
                });
            }

            function state_clicked(d) {
                g.selectAll("#cities").remove();

                if (d && state !== d) {
                    var xyz = get_xyz(d);
                    state = d;

                    country_code = state.id.substring(0, 3).toLowerCase();
                    state_name = state.properties.name;

                    plotEarthquakes(2.5);
                    zoom(xyz);

                } else {
                    state = null;
                    country_clicked(country);
                }
            }

            $(window).resize(function() {
                var w = $("#map5").width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });

        });

    }

    Template.linegraph1.created = function() {

        _.defer(function () {
            // do something
            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var parseDate = d3.time.format("%d-%b-%y").parse;

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.close); });

            var svg = d3.select("#linegraph1").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            function plotline(file, cssClass)
            {
                d3.tsv(file, function(error, data) {
                  data.forEach(function(d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;
                  });

                  x.domain(d3.extent(data, function(d) { return d.date; }));
                  y.domain(d3.extent(data, function(d) { return d.close; }));

                  svg.append("path")
                      .datum(data)
                      .attr("class", cssClass)
                      .attr("d", line);
                });
            }

            plotline("data/linedata3.tsv", "line");
            plotline("data/linedata4.tsv", "line2");

            // Generate the legend
            svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

            svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Price ($)");
        });
    }

    Template.reactivebars.created = function () {

        // We need to wait until the DOM is loaded, so we use defer
        _.defer(function () {

            window.chart = {}  // Create chart element in window namespace

            // We make this Reactive using Deps.autorun
            Deps.autorun(function () {

                // Theres some stuff we only want to run once
                if (Deps.currentComputation.firstRun) {

                    // 1) Margin and Dimension Data
                    window.chart.margin = {top: 15, right: 5, bottom: 5, left: 5},
                    window.chart.width  = 600 - window.chart.margin.left - window.chart.margin.right,
                    window.chart.height = 120 - window.chart.margin.top - window.chart.margin.bottom;

                    // 2) Scaling

                    /*
                    Set the chart's X scale _ordinally_ so it spaces out the elements evenly.

                    Let D3 do this math for you: 
                    https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeBands
                    */
                    window.chart.x = d3.scale.ordinal()
                        .rangeRoundBands([0, window.chart.width], .1);

                    /*
                    Set the chart Y scale _linearly_ so it grows with the elements

                    https://github.com/mbostock/d3/wiki/Quantitative-Scales
                    http://alignedleft.com/tutorials/d3/scales
                    */
                    window.chart.y = d3.scale.linear()
                        .range([window.chart.height-2, 0]);


                    // 3) Element Color Ranges

                    // Set the chart color range - 20c is a good one
                    window.chart.color = d3.scale.category20c();

                    // 4) Select and Append a Group

                    // Select any charts and append a wrapper class:
                    window.chart.svg = d3.select('#chart')
                            .attr("width", window.chart.width + window.chart.margin.left + window.chart.margin.right)
                            .attr("height", window.chart.height + window.chart.margin.top + window.chart.margin.bottom)
                        .append("g")    // Append a Group (thats what the 'g' means)
                            .attr("class", "wrapper")
                            .attr("transform", "translate(" + window.chart.margin.left + "," + window.chart.margin.top + ")");

                }

                // 5) Get the list of Foods
                foods = Foods.find({}, {sort: {votes: -1, name: 1}}).fetch();

                // 6) Map the foods to the possible colors (up to 20 different colors)
                window.chart.color.domain(foods.map(function(d) { return d.name }));

                // 7) Map results to the x & y domain of the chart
                window.chart.x.domain(foods.map(function(d) { return d.name }));
                window.chart.y.domain([0, d3.max(foods, function(d) { return d.votes; })]);

                // 8) Binding - Bind the food data

                // Select the chart bar elements
                var bar_selector = window.chart.svg.selectAll(".bar")
                    .data(foods, function (d) {return d.name})

                // Select the chart bar labels
                var label_selector = window.chart.svg.selectAll(".label")
                    .data(foods, function (d) {return d.name})

                // 9) Create a bar element for each food item
                bar_selector
                    .enter().append("rect") // enter the data selection and append a rect for every food element
                    .attr("class", "bar")   // attach a class to each element
                bar_selector
                    .transition()     // Add a transition animation to make the bars 'grow' and shift
                    .duration(100)
                        .attr("x", function(d) { return window.chart.x(d.name);})                               // Space out each bar based on the # of elements so we have an evenly spaced out graph
                        .attr("width", window.chart.x.rangeBand())                                              // Set the width of each bar based on the range (evenly space this out)
                        .attr("y", function(d) { return window.chart.y(d.votes); })                             // Figure out where to 'grow' the bar from
                        .attr("height", function(d) { return window.chart.height - window.chart.y(d.votes); }) 
                        .style("fill", function(d) { return window.chart.color(d.name);})                       // Fill each bar with the mapped color

                // 10) Create a label (Name + Vote count) for each food item
                label_selector
                    .enter().append("text")
                    .attr("class", "label")
                label_selector
                    .transition()                                                                               // Add transition animation to make the labels move with the bar elements
                    .duration(100)
                        .attr("x", function(d) { return window.chart.x(d.votes) + 5;})
                        .attr("y", function(d) { return window.chart.y(d.votes) - 5; })                         // 'Pull' the label up 5px from the top of the bar
                        .text(function(d) {return d.name + ': ' + d.votes;})                                    // Set the text label to the food name and vote count
                        .attr("height", function(d) { return window.chart.height - window.chart.y(d.votes); }) 

            });

        });
    };

}

if (Meteor.isServer) {
  Meteor.startup(function () {

    // Populate the collection if its empty (first run)
    if (Foods.find().count() === 0) {
      var f = [
                   "Pizza",
                   "Cheeseburger",
                   "Ham Sandwich",
                   "Chili Dog",
                   "Spicy Tuna Roll"
                ];
      for (var i = 0; i < f.length; i++)
        Foods.insert({name: f[i], votes: Math.floor(Math.random()*10)});
    }

  });
}
