;(function () {
	var AbstractGroup   = require('kevoree-entities').AbstractGroup,
        log             = require('npmlog'),

        TAG     = 'WebSocketGroup';

    var WebSocketGroup = AbstractGroup.extend({
        toString: TAG,

        construct: function () {
            log.heading = 'kevoree';
        }
    });

	module.exports = WebSocketGroup;
})();