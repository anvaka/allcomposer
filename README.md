# allcomposer

Crawls PHP composer packages database

# usage

The indexing process is straightforward, yet slow:

``` shell
node index.js
```

This will take a while (several hours), since for each package we have to do one
request. The final result is a new file `composer_package.json` with all packages
and their dependcies.

Now you are ready to run the layout (~60 minutes):

```
node layout.js
```

And save the results to binary format:

```
node toBinary.js
```

This will produce two files:

* `labels.json` - records all package names in a flat array
* `links.bin` - records all graph connections in a binary format.

These two files and the last positions file (`./data/100.pos`) needs to be copied
into the data folder of the visualization.

# license

MIT
