var fs = require('fs');
var graph = require('./lib/loadGraph.js')(process.argv[2] || 'composer_packages.json');
var labels = getLabels(graph);

saveLinks(graph, labels);
saveLabels(labels);
console.log('Done.');
console.log('Copy `links.bin`, `labels.bin` and last position file (e.g. `./data/100.pos`) into vis folder');

function saveLabels(labels) {
  fs.writeFileSync('labels.json', JSON.stringify(labels), 'utf8');
  console.log(labels.length + ' labels saved to labels.json');
}

function getLabels(graph) {
  var labels = [];
  graph.forEachNode(saveNode);

  return labels;

  function saveNode(node) {
    labels.push(node.id);
  }
}

function saveLinks(graph, labels) {
  var nodeMap = Object.create(null);

  labels.forEach(function(element, i) {
    nodeMap[element] = i;
  });

  var linksCount = graph.getLinksCount();
  var buf = new Buffer((labels.length + linksCount) * 4);
  var idx = 0;
  graph.forEachNode(function (node) {
    var startWriten = false;
    var start = nodeMap[node.id];
    graph.forEachLinkedNode(node.id, saveLink, true);

    function saveLink(node) {
      if (!startWriten) {
        startWriten = true;
        // -1 to avoid 0 uncertainty
        buf.writeInt32LE(-start - 1, idx);
        idx += 4;
      }
      var other = nodeMap[node.id];

      buf.writeInt32LE(other, idx);
      idx += 4;
    }
  });
  fs.writeFileSync('links.bin', buf.slice(0, idx));
  console.log(linksCount + ' links saved to links.bin');
}
