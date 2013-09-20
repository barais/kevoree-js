var Core            = require('kevoree-core'),
    kLib            = require('kevoree-library'),
    config          = require('./config.json'),
    modelJson       = require(config.model),
    NPMBootstrapper = require('kevoree-commons').NPMBootstrapper,
    KevoreeLogger   = require('kevoree-utils').KevoreeLogger;

var log             = new KevoreeLogger('KevoreeNodeJSRuntime'),
    kevoreeCore     = new Core(__dirname, log),
    jsonLoader      = new kLib.org.kevoree.loader.JSONModelLoader(),
    bootstrapper    = new NPMBootstrapper(__dirname),
    nodeName        = config.nodeName;

kevoreeCore.on('started', function () {
    var bootstrapModel = jsonLoader.loadModelFromString(JSON.stringify(modelJson)).get(0);
    // TODO check if there is a JavascriptNode and a Group in this model
    // otherwise there is no point in deploy this model cause it won't bootstrap
    kevoreeCore.deploy(bootstrapModel);
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