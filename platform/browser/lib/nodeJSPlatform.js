var KevNodeJSRuntime = require('kevoree-nodejs-runtime'),
  config             = require('./../config'),
  fs                 = require('fs'),
  path               = require('path'),
  kevoree            = require('kevoree-library').org.kevoree;

var serializer = new kevoree.serializer.JSONModelSerializer();

module.exports = function (modulesPath) {
  var knjs = new KevNodeJSRuntime(modulesPath);

  knjs.on('started', function () {
    knjs.deploy();
  });

  knjs.on('deployed', function (model) {
    fs.writeFile(path.resolve('model.json'), JSON.stringify(JSON.parse(serializer.serialize(model)), null, 4), function (err) {
      if (err) {
        return console.error("Unable to write deployed model to server root :/");
      }

      console.log(">>>> model deployed to server platform >>>>> model.json written in server's root folder");
    })
  });

  knjs.start(config.nodeJSPlatform.nodeName, config.nodeJSPlatform.groupName);
}