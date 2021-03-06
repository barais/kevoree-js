var AdaptationPrimitive = require('./AdaptationPrimitive'),
  StopInstance        = require('./StopInstance');

module.exports = AdaptationPrimitive.extend({
  toString: 'StartInstance',

  execute: function (_super, callback) {
    _super.call(this, callback);

    var kInstance = this.adaptModel.findByPath(this.trace.srcPath);

    if (kInstance.name != this.node.getName() && this.isRelatedToPlatform(kInstance)) {
      var instance = this.mapper.getObject(kInstance.path());

      if (instance != undefined && instance != null) {
        instance.start();
        callback.call(this, null);
        return;

      } else {
        callback(new Error("StartInstance error: unable to start instance "+kInstance.name));
        return;
      }
    }

    callback(null);
  },

  undo: function (_super, callback) {
    _super.call(this, callback);

    var cmd = new StopInstance(this.node, this.mapper, this.adaptModel, this.trace);
    cmd.execute(callback);

    return;
  }
});