var AbstractComponent   = require('kevoree-entities').AbstractComponent,
  KevoreeLogger       = require('kevoree-commons').KevoreeLogger;

/**
 * Kevoree component
 * @type {HelloWorldComponent}
 */
var HelloWorldComponent = AbstractComponent.extend({
  toString: 'HelloWorldComponent',

  construct: function () {
    this.log = new KevoreeLogger(this.toString());
    this.id = null;
  },

  /**
   *
   */
  start: function () {
    var self = this;

    this.log.info('Hello world!');

    this.id = setInterval(function () {
      // send a message through output port 'sendText' every 2 seconds
      self.out_sendText('hello world '+(new Date));
    }, 2000);
  },

  stop: function () {
    clearInterval(this.id);
    this.id = null;
  },

  // define an output port called "sendText" (this will be bind later with a function to send your messages through it)
  out_sendText: null,

  // print messages to std output when received from input port 'fake'
  in_fake: function (msg) {
    this.log.info("Message received: "+ msg);
  }
});

module.exports = HelloWorldComponent;