var rp = require('request-promise');
var fs = require('fs');
var outputFileName = 'composer_packages_index.json';
var query = 'http://packagist.org/search.json?per_page=100&q=&page=';
var lastIndex = 0;
var totalWorkers = 10;
var total = 0;
var activeWorkers = 0;
var all = [];
var done = false;

console.log('Generating list of all php packages');
getNext();

function getNext() {
  if (!done) {
    for (var i = activeWorkers; i < totalWorkers; ++i) {
      startWorker();
    }
  }
  if (done && activeWorkers === 0) {
    all = Object.keys(all);
    // everybody is done
    fs.writeFileSync(outputFileName, JSON.stringify(all), 'utf8');
    console.log('Done!');
    console.log('Saved ' + all.length + ' packages into ' + outputFileName);
    console.log('Now index dependencies using');
    console.log(' node indexDependencies.js ./' + outputFileName);
  }
}

function startWorker() {
  lastIndex += 1;
  activeWorkers += 1;
  rp(query + lastIndex)
    .then(join)
    .catch(reportError);
}

function reportError(err) {
  console.error(err);
  throw err;
}

function join(res) {
  activeWorkers -= 1;
  res = JSON.parse(res);
  var packages = res.results;
  total += packages.length;
  for (var i = 0; i < packages.length; ++i) {
    var pkg = packages[i];
    all[pkg.name] = 1;
  }
  console.log('Download ' + total + ' packages');
  done = !res.next;
  getNext();
}
