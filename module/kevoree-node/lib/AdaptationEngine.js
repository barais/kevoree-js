;(function () {
    var Class   = require('./Class'),
        kLib    = require('./org.kevoree.model.js.merged');

    var AdaptationEngine = Class({
        toString: 'AdaptionEngine',

        processTrace: function (trace) {
            switch (trace.traceType) {
                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD:
                    //return processAdds(trace);

                // TODO
                case kLib.org.kevoree.modeling.api.util.ActionType.$SET:
                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE:
                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD_ALL:
                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE_ALL:
                case kLib.org.kevoree.modeling.api.util.ActionType.$RENEW_INDEX:
                default:
                    return function () {
                        console.log(JSON.stringify(trace, null, 2));
                    }
            }
        }
    });

    var processAdds = function processAdds(trace) {

    }

    module.exports = AdaptationEngine;
})();