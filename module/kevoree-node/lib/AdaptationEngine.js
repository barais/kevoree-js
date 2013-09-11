;(function () {
    var Class   = require('./Class'),
        kLib    = require('./org.kevoree.model.js.merged');

    var AdaptationEngine = Class({
        toString: 'AdaptionEngine',

        processTrace: function (trace) {
            // TODO
            switch (trace.traceType) {
                case kLib.org.kevoree.modeling.api.util.ActionType.$SET:
                    break;

                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD:
                    break;

                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE:
                    break;

                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD_ALL:
                    break;

                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE_ALL:
                    break;

                case kLib.org.kevoree.modeling.api.util.ActionType.$RENEW_INDEX:
                    break;

                default:
                    break;
            }

            return function () {
                console.log("TODO ADAPTATION!!!");
            }
        }
    });

    module.exports = AdaptationEngine;
})();