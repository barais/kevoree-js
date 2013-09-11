;(function () {
    var Core    = require('../../core/Core'),
        kLib    = require('../../org.kevoree.model.js/target/js/org.kevoree.model.js.merged'),
        config  = require('./config.json');

    var kevoreeCore = new Core(__dirname);
    var jsonLoader  = new kLib.org.kevoree.loader.JSONModelLoader();

    var nodeName    = config.nodeName,
        modelJSON   = require(config.model),
        model       = jsonLoader.loadModelFromString(JSON.stringify(modelJSON)).get(0);

    kevoreeCore.start(nodeName, model, function (err) {
        if (err) {
            console.error(err.message);
            return;
        }

        var model2JSON  = require('./jsNodeAndCompModel.json'),
            model2      = jsonLoader.loadModelFromString(JSON.stringify(model2JSON)).get(0);

        kevoreeCore.deploy(model2, null, function (er, model) {
            if (er) {
                console.error(er.message);
                return;
            }

            // deploy success
            console.log("deploy success youpi");
        });
    });
})();