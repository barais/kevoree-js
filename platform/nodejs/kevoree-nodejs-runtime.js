;(function () {
    var Core    = require('kevoree-core'),
        kLib    = require('kevoree-library'),
        config  = require('./config.json'),
        log     = require('npmlog');

    log.heading = 'kevoree';
    var TAG     = 'KevoreeNodeJSRuntime';

    var kevoreeCore = new Core(__dirname);
    var jsonLoader  = new kLib.org.kevoree.loader.JSONModelLoader();

    var nodeName    = config.nodeName,
        modelJSON   = require(config.model),
        model       = jsonLoader.loadModelFromString(JSON.stringify(modelJSON)).get(0);

    // TODO
    // add some verifications over the fact that it is not 100% sure that there is
    // an instance of nodeName in the given model => if there is no instance add it
    // Same goes for the group
    // !!for now I use a trustable model, but in the future this can't be enough!!
    kevoreeCore.on('started', function () {
        var groupName   = config.groupName,
            model2JSON  = require('./nodegroup.json'),
            model2      = jsonLoader.loadModelFromString(JSON.stringify(model2JSON)).get(0);

        kevoreeCore.deploy(model2, null);
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

    // start Kevoree Core
    kevoreeCore.start(nodeName, model);
})();