var express = require('express'),
    routes  = require('./site/routes');

var app = express();

app.use(express.static('site/public'));
app.set('views', __dirname + '/site/views');

// rendering engine (basic html renderer)
app.engine('html', require('ejs').renderFile);


// server routes
app.get('/', routes.index);
app.get('/bootstrap', routes.bootstrap);
app.get('/resolve', routes.resolve);

module.exports = app;