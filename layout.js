var fs = require('fs');
var path = require('path');

var getGraph = require('./lib/convertToGraph.js');

var inputFileName = process.argv[2] || 'composer_packages.json';
var input = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));
var graph = getGraph(input);
var layout = require('ngraph.forcelayout3d')(graph);

console.log('Graph loaded.');
console.log(graph.getNodesCount() + ' nodes; ' + graph.getLinksCount() + ' edges;');
console.log('Starting layout...');
for (var step = 0; step < 501; ++step) {
  layout.step();
  if (step % 5 === 0) {
    saveIteration(Math.round(step/5));
  }
}

function saveIteration(name) {
  var fname = path.join('data', name + '.pos');

  console.log("Saving: ", fname);
  var nodesLength = graph.getNodesCount();
  var buf = new Buffer(nodesLength * 4 * 3);
  var i = 0;

  graph.forEachNode(function (node) {
    var idx = i * 4 * 3;
    var pos = layout.getNodePosition(node.id);
    buf.writeInt32LE(pos.x, idx);
    buf.writeInt32LE(pos.y, idx + 4);
    buf.writeInt32LE(pos.z, idx + 8);
    i++;
  });

  fs.writeFileSync(fname, buf);
}
