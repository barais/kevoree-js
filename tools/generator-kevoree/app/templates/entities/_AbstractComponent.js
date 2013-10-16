// if you have already created your own Component extending AbstractComponent
// you can replace AbstractComponent here and use your own
// ex: var MyComp = require('./path/to/MyComp')
// the only thing needed is that the top level component extends AbstractComponent :)
var AbstractComponent = require('kevoree-entities').AbstractComponent,
    KevoreeLogger     = require('kevoree-commons').KevoreeLogger;

/**
 * Kevoree component
 * @type {<%= entityName %>}
 */
var <%= entityName %> = <%= entityType %>.extend({
  toString: '<%= entityName %>',

  construct: function () {
    this.log = new KevoreeLogger(this.toString());

  },

  /**
   * this method will be called by the Kevoree platform when your component has to start
   */
  start: function () {
    // TODO
  },

  /**
   * this method will be called by the Kevoree platform when your component has to stop
   */
  stop: function () {
    // TODO
  }
});

module.exports = <%= entityName %>;
