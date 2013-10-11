var Core                = require('kevoree-core'),
    config              = require('./config.json'),
    NodeJSBootstrapper  = require('./lib/NodeJSBootstrapper'),
    KevoreeLogger       = require('kevoree-commons').KevoreeLogger,
    bootstrapHelper     = require('./lib/bootstrapHelper');

var log             = new KevoreeLogger('KevoreeNodeJSRuntime'),
    kevoreeCore     = new Core(__dirname, log),
    bootstrapper    = new NodeJSBootstrapper(__dirname),
    nodeName        = config.nodeName;

kevoreeCore.on('started', function () {
    bootstrapHelper(nodeName, function (err, model) {
        if (err) return console.error("Unable to generate bootstrap model\n"+err.message);

        kevoreeCore.deploy(model);
    });
});

kevoreeCore.on('deployed', function (err, model) {
    // deploy success

});

kevoreeCore.on('stopped', function (err, model) {
    // kevoree core stopped
});

kevoreeCore.on('error', function (err) {
    log.error(err.stack);
    // try to stop Kevoree Core on error
    kevoreeCore.stop();
});

// set Kevoree bootstrapper
kevoreeCore.setBootstrapper(bootstrapper);

// start Kevoree Core
kevoreeCore.start(nodeName);