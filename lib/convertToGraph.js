var createGraph = require('ngraph.graph');
var emptyArray = [];
module.exports = toGraph;

function toGraph(allPackages) {
  var graph = createGraph({uniqueLinkId: false});
  allPackages.forEach(addToGraph);

  return graph;

  function addToGraph(pkg) {
    console.log(pkg.name);
    graph.addNode(pkg.name);
    var dependencies = getPackageDeps(pkg.require);
    for (var i = 0; i < dependencies.length; ++i) {
      console.log(' -> ' + dependencies[i]);
      graph.addLink(pkg.name, dependencies[i]);
    }
  }
}

function getPackageDeps(requires) {
  if (!requires) return emptyArray;
  return Object.keys(requires).filter(byPackageNames);
}

function byPackageNames(str) {
  return str && str.indexOf('/') > -1;
}
