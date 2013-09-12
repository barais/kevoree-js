;(function () {
    var Class   = require('./Class'),
        kLib    = require('./org.kevoree.model.js.merged');

    var AdaptationEngine = Class({
        toString: 'AdaptionEngine',

        construct: function (node) {
            this.node = node;
            this.adaptationsCache = {};
            this.adaptationsList = [
                // TODO add adaptation command file in adaptations/ folder
                // and its name here without.js
                'AddInstance',
                'Noop'
            ];
        },

        /**
         * Process the trace to find the right adaptation primitive command
         * Returns a command to execute in order to do the adaptation logic
         * @param trace
         * @param model
         * @returns {Function}
         */
        processTrace: function (trace, model) {
            switch (trace.traceType) {
                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD:
                    if (trace.typename) {
                        switch (trace.typename) {
                            case 'org.kevoree.Group':
                            case 'org.kevoree.Node':
                            case 'org.kevoree.ComponentInstance':
                            case 'org.kevoree.Channel':
                                var adaptation = this.getAdaptation('AddInstance');
                                var instance = model.findByPath(trace.previouspath);
                                adaptation.setTypeDefinition(instance.getTypeDefinition());
                                return adaptation;
                        }
                    }

                // TODO
                case kLib.org.kevoree.modeling.api.util.ActionType.$SET:
                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE:
                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD_ALL:
                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE_ALL:
                case kLib.org.kevoree.modeling.api.util.ActionType.$RENEW_INDEX:
                default:
                    console.log(JSON.stringify(trace, null, 2));
                    return this.getAdaptation('Noop');
            }
        },

        getAdaptation: function (name) {
            if (this.adaptationsCache[name]) return this.adaptationsCache[name];
            var AdaptationObject = require('./adaptations/'+name+'.js');
            this.adaptationsCache[name] = new AdaptationObject(this.node);
            return this.adaptationsCache[name];
        }
    });

    module.exports = AdaptationEngine;
})();