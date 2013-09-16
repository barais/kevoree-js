;(function () {
	var AbstractComponent   = require('kevoree-entities').AbstractComponent,
        log                 = require('npmlog'),

        TAG     = 'HelloWorldComponent';

    var HelloWorldComponent = AbstractComponent.extend({
        toString: TAG,

        construct: function () {
            log.heading = 'kevoree';
        }
    });

	module.exports = HelloWorldComponent;
})();