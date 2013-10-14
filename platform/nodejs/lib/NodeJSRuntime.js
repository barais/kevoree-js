var Class         = require('pseudoclass'),
  KevoreeCore     = require('kevoree-core'),
  KevoreeLogger   = require('kevoree-commons').KevoreeLogger,
  Bootstrapper    = require('./NodeJSBootstrapper'),
  bootstrapHelper = require('./bootstrapHelper'),
  path            = require('path'),
  EventEmitter    = require('events').EventEmitter;

var NodeJSRuntime = Class({
  toString: 'NodeJSRuntime',

  construct: function (modulesPath) {
    this.modulesPath = modulesPath || path.resolve(__dirname, '..');
    this.log = new KevoreeLogger(this.toString());
    this.kCore = new KevoreeCore(this.modulesPath, this.log);
    this.bootstrapper = new Bootstrapper(this.modulesPath);
    this.nodename = 'node0'; // default nodename
    this.groupname = 'sync'; // default groupname
    this.emitter = new EventEmitter();
    this.model = null;
  },

  init: function () {
    this.kCore.setBootstrapper(this.bootstrapper);
    var self = this;

    // kevoree core started event listener
    this.kCore.on('started', function () {
      self.emitter.emit('started');
    });

    // kevoree core deployed event listener
    this.kCore.on('deployed', function (model) {
      self.emitter.emit('deployed', model);
    });

    // kevoree core error event listener
    this.kCore.on('error', function (err) {
      self.log.error(err.stack);
      self.kCore.stop();
      self.emitter.emit('error', err);
    });
  },

  start: function (nodename, groupname) {
    // TODO add some verification over given names (no spaces & stuff like that)
    this.nodename = nodename || this.nodename;
    this.groupname = groupname || this.groupname;

    this.kCore.start(this.nodename, this.groupname);
  },

  deploy: function (model) {
    if (typeof(model) == 'undefined') {
      var self = this;
      // deploy default bootstrap model
      bootstrapHelper(this.nodename, this.groupname, this.modulesPath, function (err, model) {
        self.kCore.deploy(model);
      });
    } else {
      // if a model has been given: use it to bootstrap
      this.kCore.deploy(model);
    }
  },

  on: function (event, callback) {
    this.emitter.addListener(event, callback);
  }
});

module.exports = NodeJSRuntime;