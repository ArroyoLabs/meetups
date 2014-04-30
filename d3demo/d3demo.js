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
        this.route("bars", {
            path: "/bars",
            template: "bars"
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
