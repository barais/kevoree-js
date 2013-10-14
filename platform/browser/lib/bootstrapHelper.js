var npm         = require('npm'),
    KevoreeCore = require('kevoree-core');

/**
 * Install groupType locally
 * @param model
 * @param targetNodeName
 * @param callback function(err, grp)
 */
var bootstrapHelper = function bootstrapHelper(model, targetNodeName, callback) {
  // load npm
  npm.load({}, function (err) {
    if (err) return callback(err);

    if (model.groups && model.groups.size() > 0) {
      var kGroups = model.groups.iterator();
      while (kGroups.hasNext()) {
        var kGrp = kGroups.next();
        if (kGrp.subNodes && kGrp.subNodes.size() > 0) {
          var subNodes = kGrp.subNodes.iterator();
          while (subNodes.hasNext()) {
            var kNode = subNodes.next();
            if (kNode.name == targetNodeName) {
              return installGroupType(model, targetNodeName, kGrp, callback);
            }
          }

        } else {
          return callback(new Error('BootstrapHelper error: target node "'+targetNodeName+'" isn\'t linked to any group instance.'));
        }
      }
    } else {
      return callback(new Error('BootstrapHelper error: given model does not contain group instances.'));
    }
  });
}

/**
 * Install the targetNode's group type locally
 * @param model
 * @param targetNodeName
 * @param kGrp a kevoree model group instance (related to targetNode)
 * @param callback function(err, grp)
 */
var installGroupType = function installGroupType(model, targetNodeName, kGrp, callback) {
  var packageName = kGrp.typeDefinition.deployUnits.get(0).unitName,
    versionName = kGrp.typeDefinition.deployUnits.get(0).version;

  npm.commands.install([packageName+'@'+versionName], function installKevWSGrpCb(err) {
    if (err) return callback(new Error('npm failed to install "'+packageName+'@'+versionName+'" module'));

    // DOING SOME NASTY STUFFS THERE
    // this is the only way (for now) to let the user
    // call push() and pull()
    // it's like bootstrapping a fake KevoreeCore platform
    var kCore = new KevoreeCore();
    kCore.deployModel = model; // omg
    kCore.currentModel = model; // omg
    var AbstractGroup = require(packageName);
    var grp = new AbstractGroup();
    grp.name = kGrp.name;
    grp.path = kGrp.path();
    grp.nodeName = targetNodeName;
    grp.kCore = kCore;

    return callback(null, grp);
  });
}

module.exports = bootstrapHelper;