var express        = require('express'),
    path           = require('path'),
    routes         = require('./routes'),
    clean          = require('./lib/cleanBrowserLibz'),
    kevNodeJSPlat  = require('./lib/nodeJSPlatform');

var app = express();

app.use(express.static('site/public'));
app.set('views', __dirname + '/site/views');

// rendering engine (basic html renderer)
app.engine('html', require('ejs').renderFile);

// clean browserified libraries on server start-up
clean();

// start a kevoree nodejs platform server-side
kevNodeJSPlat(path.resolve(__dirname));

// server routes
app.get('/', routes.index);
app.get('/bootstrap', routes.bootstrap);
app.get('/resolve', routes.resolve);

module.exports = app;