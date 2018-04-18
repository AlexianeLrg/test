/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */

function partiNameConverter(name) {
 var converted;

 switch(name) {
   case "Gauche démocrate et républicaine":
     converted = 'GDR';
     break;
   case "Europe Écologie Les Verts":
   converted = 'EELV';
     break;
   case "Parti socialiste":
   converted = 'PS';
     break;
   case "Parti radical de gauche":
   converted = 'PRG';
     break;
   case "Union des démocrates et indépendants":
   converted = 'UDI';
     break;
   case "Les Républicains":
   converted = 'LR';
     break;
   case "Debout la France":
   converted = 'DLF';
     break;
   case "Front National":
   converted = 'FN';
     break;
   case "Autres":
   converted = 'Autres';
     break;
 }
 return converted;
}

function bubbleChart() {
  var margin = {top: 20, right: 10, bottom: 20, left: 10};

  var width = document.documentElement.clientWidth - margin.left - margin.right;
  var height = (document.documentElement.clientHeight - 51) - margin.top - margin.bottom;

  var center = {
    x: width / 2,
    y: height / 2
  };

  var circleRadius = 4;
  var strokeWidth = 1;

  var ageScale = d3.scaleLinear()
  .domain([20, 90])
  .range([height - 50, 50]);

  var mandatScale = d3.scaleLinear()
  .domain([0, 9])
  .range([height - 50, 50]);

  var sexScale = d3.scaleBand()
  .domain(['♂', '♀'])
  .range([height - 50, 50]);

  var partiInitials = [
    "GDR",
    "EELV",
    "PS",
    "PRG",
    "UDI",
    "LR",
    "DLF",
    "FN",
    "Autres"
  ];

  var commissions = {
    "Affaires culturelles et éducation": {
      x: 1,
      y: 1
    },
    "Affaires étrangères": {
      x: 2,
      y: 1
    },
    "Défense nationale et forces armées": {
      x: 3,
      y: 1
    },
    "Affaires économiques": {
      x: 4,
      y: 1
    },
    "Développement durable et aménagement du territoire": {
      x: 1,
      y: 2
    },
    "Finances": {
      x: 2,
      y: 2
    },
    "Lois": {
      x: 3,
      y: 2
    },
    "Affaires sociales": {
      x: 4,
      y: 2
    }
  };

  var commissionXScale = d3.scaleBand()
  .domain([1, 2, 3, 4])
  .range([0, width])
  .paddingOuter(0.5)
  .paddingInner(1);

  var commissionYScale = d3.scaleBand()
  .domain([1, 2])
  .range([30, height])
  .paddingOuter(0.5)
  .paddingInner(1);

  var partyScale = d3.scaleBand()
  .domain(partiInitials)
  .range([30, width - 30])
  .paddingOuter(0.5)
  .paddingInner(1);

  var regionXScale = d3.scaleBand()
  .domain([1, 2, 3, 4, 5])
  .range([0, width])
  .paddingOuter(0.5)
  .paddingInner(1);

  var regionYScale = d3.scaleBand()
  .domain([1, 2, 3])
  .range([30, height])
  .paddingOuter(0.5)
  .paddingInner(1);

  var partis = {
    'Parti socialiste': {
      x: 1 * width / 5,
      y: 2.5 * height / 5
    },
    'Union des démocrates et indépendants': {
      x: 2.5 * width / 5,
      y: 2.5 * height / 5
    },
    'Les Républicains': {
      x: 4 * width / 5,
      y: 2.5 * height / 5
    },
    'Gauche démocrate et républicaine': {
      x: 1 * width / 5,
      y: 4 * height / 5
    },
    'Europe Écologie Les Verts': {
      x: 1 * width / 5,
      y: 1 * height / 5
    },
    'Front National': {
      x: 4 * width / 5,
      y: 1 * height / 5
    },
    'Parti radical de gauche': {
      x: 2.5 * width / 5,
      y: 1 * height / 5
    },
    'Autres': {
      x: 2.5 * width / 5,
      y: 4 * height / 5
    },
    'Debout la France': {
      x: 4 * width / 5,
      y: 4 * height / 5
    }
  };

  var regions = {
    'Normandie': {
      x: 2,
      y: 1
    },
    'Bourgogne-Franche-Comté': {
      x: 4,
      y: 2
    },
    'Bretagne': {
      x: 1,
      y: 1
    },
    'Centre-Val de Loire': {
      x: 2,
      y: 2
    },
    'Français établis hors de France': {
      x: 5,
      y: 1
    },
    'France d\'outre-mer': {
      x: 5,
      y: 3
    },
    'Grand-Est': {
      x: 4,
      y: 1
    },
    'Hauts-de-France': {
      x: 3,
      y: 1
    },
    'Ile-de-France': {
      x: 3,
      y: 2
    },
    'Auvergne-Rhône-Alpes': {
      x: 5,
      y: 2
    },
    'Nouvelle-Aquitaine': {
      x: 1,
      y: 3
    },
    'Occitanie': {
      x: 2,
      y: 3
    },
    'Pays de la Loire': {
      x: 1,
      y: 2
    },
    'Provence-Alpes-Côte d\'Azur': {
      x: 3,
      y: 3
    },
    'Corse': {
      x: 4,
      y: 3
    }
  };

  // These will be set in create_nodes and create_vis
  var svg = null;
  var circles = null;
  var partiGridLines = null;

  var ageAxisSelect = null;
  var sexAxisSelect = null;
  var mandatAxisSelect = null;
  var partyAxisSelect = null;
  var sexLegendContainer = null;
  var ageLegendContainer = null;
  var mandatLegendContainer = null;

  var forceStrength = 0.03;

  var containerElem = document.getElementById('container');

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .direction(function(d) {
      var mouseCoords = d3.mouse(containerElem);

      var x = mouseCoords[0];
      var y = mouseCoords[1];

      return (y > height / 2) ? 'n' : 's';
    })
    .offset(function() {
      var mouseCoords = d3.mouse(containerElem);

      var x = mouseCoords[0];
      var y = mouseCoords[1];

      return (y > height / 2) ? [0, 20] : [20, 0];
    })
    .html(function(d) {
      return [
        '<div class="c-tooltip">',
          '<div class="c-tooltip__row">',
            '<div class="c-tooltip__image">',
              '<img src="' + d.imageSrc + '">',
            '</div>',
          '</div>',
          '<div class="c-tooltip__row">',
            '<p style="margin-right: 5px; white-space: nowrap; text-align: right;">Nom :</p>',
            '<p>' + d.name + '</p>',
          '</div>',
          '<div class="c-tooltip__row">',
            '<p style="margin-right: 5px; white-space: nowrap; text-align: right;">Parti :</p>',
            '<p>' + d.groupe + '</p>',
          '</div>',
          '<div class="c-tooltip__row">',
            '<p style="margin-right: 5px; white-space: nowrap; text-align: right;">Age :</p>',
            '<p>' + d.value + ' ans</p>',
          '</div>',
          '<div class="c-tooltip__row">',
            '<p style="margin-right: 5px; white-space: nowrap; text-align: right;">Commission :</p>',
            '<p>' + d.commission + '</p>',
          '</div>',
          '<div class="c-tooltip__row">',
            '<p style="margin-right: 5px; white-space: nowrap; text-align: right;">Département :</p>',
            '<p>' + d.departement + '</p>',
          '</div>',
          '<div class="c-tooltip__row">',
            '<p style="margin-right: 5px; white-space: nowrap; text-align: right;">Mandats réalisés :</p>',
            '<p>' + d.nb_mandats + '</p>',
          '</div>',
        '</div>'].join('\n');
    });

  // Nice looking colors - no reason to buck the trend
  var ageColorScale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4])
    .range(['#ffeb00', '#ff7700', '#b2002a', '#b2002a']);

  var sexColorScale = d3.scaleOrdinal()
    .domain([0,1])
    .range(['#ff003c','#49a7ff']);

  var mandatColorScale = d3.scaleOrdinal()
    .domain([1,2,3,4,5,6,7,8,9])
    .range(['#D9EDA2','#D9EDA2','#D9EDA2','#98CE00','#98CE00','#98CE00','#537100','#537100','#537100']);

  var chart = function chart(selector, rawData) {

    data = rawData.map(function(d, index) {
      return {
        id: d.id,
        radius: circleRadius,
        value: d.Age,
        name: d.person__fullname,
        parti: d.Parti,
        genre: d.person__gender,
        classe: d.Classedage,
        groupe: d.group,
        commission: d.commission,
        departement: d.Departement,
        region: d.Region,
        imageSrc: d.person__image,
        nb_mandats: d['Nb de mandats'],
        x: Math.random() * 900,
        y: Math.random() * 800
        // sort here to get a prettier bubble
      };
    }).sort(function(a, b) { return b.value - a.value; });

    svg = d3.select(selector)
      .append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var mandatAxis = d3.axisLeft(mandatScale).ticks(9);

    var ageAxis = d3.axisLeft(ageScale).ticks(5);

    var partyAxis = d3.axisBottom(partyScale);

    var sexAxis = d3.axisLeft(sexScale).ticks(2);

    partiGridLines = d3.select(selector)
    .append('div')
    .attr('id', 'overlay')
    .classed('overlay', true)
    .style('opacity', 0);

    partiInitials.forEach(function(partiInitial) {
      if (partiInitial === 'Autres') {
        return false;
      }

      d3.select('#overlay')
      .append('div')
      .classed('gridline', true)
      .style('left', function(d) {
        return partyScale(partiInitial) + (partyScale.step() / 2) + 'px';
      });
    });

    ageLegendContainer = svg.append('g')
      .attr('class', 'age-legend')
      .style('opacity', 1)
      .attr('transform', 'translate(' + (width / 2 - 90) + ',0)');

    var ageLegendScale = ageColorScale.copy();

    ageLegendScale.domain(['< 40ans', '40 - 60 ans', '> 60ans']);

    var ageLegend = d3.legendColor()
      .shape('path', d3.symbol().type(d3.symbolCircle).size(100)())
      .shapePadding(80)
      .orient('horizontal')
      .scale(ageLegendScale);

    svg.select('.age-legend')
    .call(ageLegend);

    mandatLegendContainer = svg.append('g')
      .attr('class', 'mandat-legend')
      .style('opacity', 0)
      .attr('transform', 'translate(' + (width / 2 - 90) + ',0)');

    var mandatLegendScale = mandatColorScale.copy();

    mandatLegendScale
    .domain(['1 - 3 mandats', '4 - 6 mandats', '7 mandats et +'])
    .range(['#D9EDA2','#98CE00','#537100']);

    var mandatLegend = d3.legendColor()
      .shape('path', d3.symbol().type(d3.symbolCircle).size(100)())
      .shapePadding(80)
      .orient('horizontal')
      .scale(mandatLegendScale);

    svg.select('.mandat-legend')
      .call(mandatLegend);

    var sexLegendScale = sexColorScale.copy();

    sexLegendScale.domain(['Femmes', 'Hommes']);

    sexLegendContainer = svg.append('g')
      .attr('class', 'sex-legend')
      .style('opacity', 0)
      .attr('transform', 'translate(' + (width / 2 - 20) + ',0)');

    var sexLegendScale = sexColorScale.copy();

    sexLegendScale.domain(['Femmes', 'Hommes']);

    var sexLegend = d3.legendColor()
      .shape('path', d3.symbol().type(d3.symbolCircle).size(100)())
      .shapePadding(40)
      .orient('horizontal')
      .scale(sexLegendScale);

    svg.select('.sex-legend')
      .call(sexLegend);

    mandatAxisSelect = svg
      .append('g')
      .style('opacity', 1)
      .attr("class", "axis")
      .attr("transform", "translate(30,0)")
      .call(mandatAxis)


    mandatAxisSelect.append("text")
      .classed('axis-label', true)
      .attr("transform", "translate(-30,280) rotate(-90)")
      .style("text-anchor", "middle")
      .text("Nombre de mandats");

    sexAxisSelect = svg
      .append('g')
      .style('opacity', 0)
      .attr("class", "axis")
      .attr("transform", "translate(30,0)")
      .call(sexAxis)

    sexAxisSelect.append("text")
      .classed('axis-label', true)
      .attr("transform", "translate(-20,280)")
      .style("text-anchor", "middle")
      .text("Sexe");

    ageAxisSelect = svg
      .append("g")
      .style("opacity", 0)
      .attr("class", "axis")
      .attr("transform", "translate(30,0)")
      .call(ageAxis)

    ageAxisSelect.append("text")
      .classed('axis-label', true)
      .attr("transform", "translate(-30,280)")
      .style("text-anchor", "middle")
      .text("Âge");

    partyAxisSelect = svg
      .append("g")
      .attr("id", "parti")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - 50) +")")
      .call(partyAxis);

    partyAxisSelect.append("text")
      .classed('axis-label', true)
      .attr("transform", "translate(450,60)")
      .style("text-anchor", "middle")
      .text("Partis politiques");

    circles = svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('r', 0)
      .attr('fill', function(d) {
        return d3.rgb(ageColorScale(d.classe));
      })
      .attr('data-region', function(d) {
        return d.region;
      })
      .attr('cx', function(d) {
        return center.x;
      })
      .attr('cy', function(d) {
        return center.y;
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    circles.transition()
      .duration(300)
      .attr('r', function(d) { return d.radius; });

    simulation.nodes(data)
      .on('tick', function() {
        circles
          .attr('cx', function(d) {
            return d.x;
          })
          .attr('cy', function(d) {
            return d.y;
          });
      });

    groupBubbles();
  };

  var simulation = d3.forceSimulation()
    .velocityDecay(0.3)
    .alphaDecay(0.1)
    .force('collide', d3.forceCollide(function(d) {
      return d.radius + strokeWidth;
    }).iterations(1));

  function hidePartiAxes() {
    partiGridLines.transition()
    .duration(300)
    .style('opacity', 0);

    sexAxisSelect.transition()
    .duration(300)
    .style('opacity', 0);

    ageAxisSelect.transition()
    .duration(300)
    .style('opacity', 0);

    partyAxisSelect.transition()
    .duration(300)
    .style('opacity', 0);

    mandatAxisSelect.transition()
    .duration(300)
    .style('opacity', 0);
  }

  function showPartiAxes() {
    partiGridLines.transition()
    .duration(300)
    .style('opacity', 1);

    if (buttonBar.activeColor.value === 'age') {
      ageAxisSelect.transition()
      .duration(300)
      .style('opacity', 1);

      sexAxisSelect.transition()
      .duration(300)
      .style('opacity', 0);

      mandatAxisSelect.transition()
      .duration(300)
      .style('opacity', 0);
    }
    else if (buttonBar.activeColor.value === 'sex') {
      sexAxisSelect.transition()
      .duration(300)
      .style('opacity', 1);

      ageAxisSelect.transition()
      .duration(300)
      .style('opacity', 0);

      mandatAxisSelect.transition()
      .duration(300)
      .style('opacity', 0);
    }
    else {
      mandatAxisSelect.transition()
      .duration(300)
      .style('opacity', 1);

      ageAxisSelect.transition()
      .duration(300)
      .style('opacity', 0);

      sexAxisSelect.transition()
      .duration(300)
      .style('opacity', 0);
    }

    partyAxisSelect.transition()
    .duration(300)
    .style('opacity', 1);
  }

  function groupBubbles() {
    hideRegions();
    hidePartiAxes();
    hideCommissionLabels();

    simulation
      .force('center', d3.forceCenter(center.x, center.y))
      .force('charge', d3.forceManyBody().strength(-5))
      .force('y', d3.forceY(center.y))
      .force('x', d3.forceX(center.x))
      .alpha(1)
      .restart();
  }

  function splitBubblesByParti() {
    hideRegions();
    hideCommissionLabels();
    showPartiAxes();

    simulation
      .force('center', null)
      .force('charge', null)
      .force('x', d3.forceX(function(d) {
        return partyScale(partiNameConverter(d.parti));
      }).strength(0.5))
      .force('y', d3.forceY(function(d) {
        if (buttonBar.activeColor.value === 'age') {
          return ageScale(d.value);
        }
        else if (buttonBar.activeColor.value === 'sex') {
          if (d.genre === '1') {
            return sexScale('♂') + 100;
          }
          else if (d.genre === '0') {
            return sexScale('♀') + 100;
          }
        }

        return mandatScale(d.nb_mandats);
      }))
      .alpha(1)
      .restart();
  }

  function splitBubblesByRegion() {
    hidePartiAxes();
    hideCommissionLabels();
    showRegions();

    simulation
      .force('center', null)
      .force('charge', null)
      .force('x', d3.forceX(function(d) {
        return regionXScale(regions[d.region].x);
      }))
      .force('y', d3.forceY(function(d) {
        return regionYScale(regions[d.region].y);
      }))
      .alpha(1)
      .restart();
  }

  function splitBubblesByCommission() {
    hideRegions();
    hidePartiAxes();
    showCommissionLabels();

    simulation
      .force('center', null)
      .force('charge', null)
      .force('x', d3.forceX(function(d) {
        return commissionXScale(commissions[d.commission].x);
      }))
      .force('y', d3.forceY(function(d) {
        return commissionYScale(commissions[d.commission].y);
      }))
      .alpha(1)
      .restart();
  }

  function hideCommissionLabels() {
    svg.selectAll('.commission').remove();
  }

  function showCommissionLabels() {
    var commissionsData = d3.keys(commissions);

    var commissionsSelect = svg.selectAll('.commission')
      .data(commissionsData);

    commissionsSelect.enter().append('text')
      .attr('class', 'commission label')
      .attr('x', function(d) {
        return commissionXScale(commissions[d].x);
      })
      .attr('y', function(d) {
        return commissionYScale(commissions[d].y) - 50;
      })
      .attr('text-anchor', 'middle')
      .text(function(d) {
        if (d === 'Développement durable et aménagement du territoire') {
          return 'Développement durable';
        }

        return d;
      });
  }

  function hideRegions() {
    svg.selectAll('.region').remove();
  }

  function showRegions() {
    var regionsData = d3.keys(regions);

    var regionsSelect = svg.selectAll('.region')
      .data(regionsData);

    regionsSelect.enter().append('text')
      .attr('class', 'region label')
      .attr('x', function(d) {
        return regionXScale(regions[d].x);
      })
      .attr('y', function(d) {
        return regionYScale(regions[d].y) - 50;
      })
      .attr('text-anchor', 'middle')
      .text(function(d) {
        return d;
      });
  }

  chart.toggleColor = function(color) {
    if (color === 'sex') {

      ageLegendContainer.transition()
        .duration(300)
        .style('opacity', 0);

      sexLegendContainer.transition()
        .duration(300)
        .style('opacity', 1);

        mandatLegendContainer.transition()
          .duration(300)
          .style('opacity', 0);

      circles.transition()
        .duration(300)
        .attr("fill",function(d){
          return d3.rgb(sexColorScale(d.genre));
        });
    }
    else if (color === 'age') {
      ageLegendContainer.transition()
        .duration(300)
        .style('opacity', 1);

      sexLegendContainer.transition()
        .duration(300)
        .style('opacity', 0);

        mandatLegendContainer.transition()
          .duration(300)
          .style('opacity', 0);

      circles.transition()
        .duration(300)
        .attr("fill",function(d){
          return d3.rgb(ageColorScale(d.classe));
        });
    }
    else if (color === 'mandats') {
      ageLegendContainer.transition()
        .duration(300)
        .style('opacity', 0);

      sexLegendContainer.transition()
        .duration(300)
        .style('opacity', 0);

      mandatLegendContainer.transition()
        .duration(300)
        .style('opacity', 1);

      circles.transition()
        .duration(300)
        .attr("fill",function(d){
          return d3.rgb(mandatColorScale(+d.nb_mandats));
        });
    }
  };

  chart.toggleLayout = function(layout) {
    if (layout === 'parti') {
      splitBubblesByParti();
    } else if (layout === 'region') {
      splitBubblesByRegion();
    } else if (layout === 'commission') {
      splitBubblesByCommission();
    } else {
      groupBubbles();
    }
  };

  // return the chart function from closure.
  return chart;
}

var myBubbleChart = bubbleChart();

var layouts = [
  {value: 'ensemble', label: 'Ensemble'},
  {value: 'parti', label: 'Trier par parti'},
  {value: 'region', label: 'Trier par région'},
  {value: 'commission', label: 'Trier par commission'},
];

var colors = [
  {value: 'age', label: 'Afficher par age'},
  {value: 'sex', label: 'Afficher par sexe'},
  {value: 'mandats', label: 'Afficher par ancienneté'}
];

var buttonBar = new Vue({
  el: '#button-bar',
  data: {
    activeLayout: layouts[0],
    layouts: layouts,
    activeColor: colors[0],
    colors: colors
  },
  methods: {
    updateLayout(layout) {
      this.activeLayout = layout;

      this.$emit('update');
    },
    updateColor(color) {
      this.activeColor = color;

      this.$emit('update');
    }
  }
});

buttonBar.$on('update', function() {
  myBubbleChart.toggleLayout(buttonBar.activeLayout.value);

  myBubbleChart.toggleColor(buttonBar.activeColor.value);
});

// Load the data.
d3.csv('./data/mandatures.csv', function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#container', data);
});
