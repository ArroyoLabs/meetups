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

        this.route("geomap", {
            path: "/geomap",
            template: "geomap"
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
                        .attr("x", function(d) { return window.chart.x(d.name);})
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
