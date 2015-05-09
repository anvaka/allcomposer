# allcomposer

Crawls PHP composer packages database

# usage

The indexing process is multistep. First download all package names:

``` shell
node index.js
```
This will create `composer_packages_index.json` in the current folder, with
all discovered packages.

Second, crawl all dependencies:

``` shell
node indexDependencies.js
```

This will take a while (several hours), since for each package we have to do one
request. The final result is a new file `composer_package.json` with all packages
and their dependcies.

# license

MIT
