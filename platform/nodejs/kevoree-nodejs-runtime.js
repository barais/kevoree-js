var Core            = require('kevoree-core'),
    kLib            = require('kevoree-library'),
    config          = require('./config.json'),
    modelJson       = require(config.model),
    NPMBootstrapper = require('kevoree-commons').NPMBootstrapper,
    log             = require('npmlog');

var TAG             = 'KevoreeNodeJSRuntime',
    kevoreeCore     = new Core(__dirname),
    jsonLoader      = new kLib.org.kevoree.loader.JSONModelLoader(),
    bootstrapper    = new NPMBootstrapper(__dirname),
    nodeName        = config.nodeName;

// npmlog heading text
log.heading = 'runtime';

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
    log.error(TAG, err.stack);
    // try to stop Kevoree Core on error
    kevoreeCore.stop();
});

// set Kevoree bootstrapper
kevoreeCore.setBootstrapper(bootstrapper);

// start Kevoree Core
kevoreeCore.start(nodeName);