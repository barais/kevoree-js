var express = require('express'),
    routes  = require('./site/routes'),
    clean   = require('./lib/cleanBrowserLibz');

var app = express();

app.use(express.static('site/public'));
app.set('views', __dirname + '/site/views');

// rendering engine (basic html renderer)
app.engine('html', require('ejs').renderFile);

// clean browserified libraries on server start-up
clean();

// server routes
app.get('/', routes.index);
app.get('/bootstrap', routes.bootstrap);
app.get('/resolve', routes.resolve);

module.exports = app;