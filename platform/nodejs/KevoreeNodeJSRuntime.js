var Core    = require('../../core/Core'),
    kLib    = require('../../org.kevoree.model.js/target/js/org.kevoree.model.js.merged'),
    config  = require('./config.json');

var kevoreeCore = new Core();
var jsonLoader  = new kLib.org.kevoree.loader.JSONModelLoader();

var nodeName    = config.nodeName,
    modelJSON   = require(config.model),
    model       = jsonLoader.loadModelFromString(JSON.stringify(modelJSON)).get(0);

kevoreeCore.start(nodeName, model);
