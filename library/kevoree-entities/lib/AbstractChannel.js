var KevoreeEntity = require('./KevoreeEntity');

/**
 * AbstractChannel entity
 *
 * @type {AbstractChannel} extends KevoreeEntity
 */
module.exports = KevoreeEntity.extend({
  toString: 'AbstractChannel',

  construct: function () {
    this.remoteNodes = {};
    this.inputs = {};
  },

  internalSend: function (portPath, msg) {
    var remoteNodeNames = this.remoteNodes[portPath];
    for (var remoteNodeName in remoteNodeNames) {
      this.onSend(remoteNodeName, msg);
    }
  },

  /**
   *
   * @param remoteNodeName
   * @param msg
   */
  onSend: function (remoteNodeName, msg) {

  },

  remoteCallback: function (msg) {
    for (var name in this.inputs) {
      this.inputs[name].getCallback().call(this, msg);
    }
  },

  addInternalRemoteNodes: function (portPath, remoteNodes) {
    this.remoteNodes[portPath] = remoteNodes;
  },

  addInternalInputPort: function (port) {
    this.inputs[port.getName()] = port;
  }
});