var fs = require('fs');
var path = require('path');
var cli = require('ltcdr');
var chalk = require('chalk');
var express = require('express');
var marked = require('marked');
var splitter = require('./splitter');
var pkg = require('../package');
var app = express();

marked.setOptions({
  // Github Flavored Markdown
  gfm: true
});

cli.version(pkg.version)
  .option('-e, --entry-file [file]', 'Usually an index.html', './index.html')
  .option('-p, --port [port]', 'Port to run server on', process.env.PORT || 3000)
  .option('-d, --domain-host [host]', 'Host to serve static files at', 'localhost')
  .option('-x, --debug', 'Enable development logging for debugging purposes')
  .parse(process.argv);

var staticDirs = cli.args;
var entryDir;

if (cli.debug) {
  app.use(require('morgan')('dev'));
}

app.get('/', function (req, res) {
  if (cli.entryFile) {
    res.sendFile(cli.entryFile, { root: process.cwd() });
  }
  else if (staticDirs && !staticDirs.length) {
    fs.readFile(path.resolve(__dirname, '../', 'README.md'), 'utf8', function (err, file) {
      if (err) {
        res.send(500, 'Error parsing README.md');
      }

      res.send(marked(file));
    });
  }
});

// Add entryFile's parent directory to static dirs
if (cli.entryFile) {
  if (path.extname(cli.entryFile) !== '' && staticDirs.indexOf(cli.entryFile) === -1) {
    entryDir = path.dirname(cli.entryFile);

    staticDirs.unshift(entryDir);
  }
}

staticDirs.forEach(function (directory) {
  var data = splitter(directory);

  if (typeof data === 'object' && data.endpoint) {
    if (data.type === 'json') {
      app.get(data.endpoint, function (req, res) {
        res.json(require(path.resolve(data.source)));
      });
    }
    else if (data.type === 'route') {
      var route = require(path.resolve(data.source));

      if (typeof route === 'function') {
        app.use(route(app, data.endpoint, express));
      }
    }
    else {
      app.use(data.endpoint, express.static(data.source));
    }
  }
  else if (typeof data === 'string') {
    app.use(express.static(data));
  }
  else {
    throw 'Invalid static directory specified.';
  }
});

app.listen(cli.port, cli.domainHost, function () {
  console.log(chalk.green('Goat server listening on port %s'), cli.port);
});

module.exports = cli;
