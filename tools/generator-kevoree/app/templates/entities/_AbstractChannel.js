// if you have already created your own Channel extending AbstractChannel
// you can replace AbstractChannel here and use your own
// ex: var MyChan = require('./path/to/MyChan')
// the only thing needed is that the top level channel extends AbstractChannel :)
var AbstractChannel = require('kevoree-entities').AbstractChannel,
    KevoreeLogger   = require('kevoree-commons').KevoreeLogger;

/**
 * Kevoree channel
 * @type {<%= entityName %>}
 */
var <%= entityName %> = <%= entityType %>.extend({
  toString: '<%= entityName %>',

  construct: function () {
    this.log = new KevoreeLogger(this.toString());

  },

  /**
   * this method will be called by the Kevoree platform when your channel has to start
   */
  start: function () {
    // TODO
  },

  /**
   * this method will be called by the Kevoree platform when your channel has to stop
   */
  stop: function () {
    // TODO
  },

  /**
   *
   * @param remoteNodeName
   * @param msg
   */
  onSend: function (remoteNodeName, msg) {
    // TODO
  }
});

module.exports = <%= entityName %>;
