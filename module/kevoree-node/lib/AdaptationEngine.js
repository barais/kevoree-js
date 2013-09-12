;(function () {
    var Class           = require('./Class'),
        kLib            = require('./org.kevoree.model.js.merged'),
        InstanceManager = require('./InstanceManager');


    /**
     * AdaptationEngine knows each AdaptationPrimitive command available
     * for JavascriptNode.
     * Plus, it handles instances and deploy units references
     *
     * @type {AdaptationEngine}
     */
    var AdaptationEngine = Class({
        toString: 'AdaptionEngine',

        construct: function (node) {
            this.node = node;
            this.instanceManager = new InstanceManager();

            // cache commands once loaded to prevent using require() multiple times
            this.commandsCache = {};
        },

        /**
         * Process the trace to find the right adaptation primitive command
         * Returns a command to execute in order to do the adaptation logic
         * @param trace
         * @param model
         * @returns {AdaptationPrimitive}
         */
        processTrace: function (trace, model) {
            var AdaptationPrimitive, cmd;
            switch (trace.traceType) {
                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD:
                    if (trace.typename) {
                        switch (trace.typename) {
                            case 'org.kevoree.Group':
                            case 'org.kevoree.Node':
                            case 'org.kevoree.ComponentInstance':
                            case 'org.kevoree.Channel':
                                AdaptationPrimitive = this.getCommand('AddInstance');
                                cmd = new AdaptationPrimitive(this.node, this.instanceManager);
                                var instance = model.findByPath(trace.previouspath);
                                cmd.setInstance(instance);
                                return cmd;
                        }

                    } else if (trace.refname) {
                        switch (trace.refname) {
                            case 'org.kevoree.DeployUnits':
                                AdaptationPrimitive = this.getCommand('AddDeployUnit');
                                cmd = new AdaptationPrimitive(this.node, this.instanceManager);
                                var deployUnit  = model.findByPath(trace.previouspath);
                                cmd.setDeployUnit(deployUnit);
                                return cmd;
                        }
                    }

                // TODO
                case kLib.org.kevoree.modeling.api.util.ActionType.$SET:
                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE:
                case kLib.org.kevoree.modeling.api.util.ActionType.$ADD_ALL:
                case kLib.org.kevoree.modeling.api.util.ActionType.$REMOVE_ALL:
                case kLib.org.kevoree.modeling.api.util.ActionType.$RENEW_INDEX:
                default:
                    //console.log(JSON.stringify(trace, null, 2));
                    var AdaptationPrimitive = this.getCommand('Noop');
                    var cmd = new AdaptationPrimitive(this.node, this.instanceManager);
                    return cmd;
            }
        },

        /**
         * Load or retrieve from cache command by name
         * @param name
         * @returns {AdaptationPrimitive}
         */
        getCommand: function (name) {
            if (this.commandsCache[name]) return this.commandsCache[name];

            this.commandsCache[name] = require('./adaptations/'+name+'.js');
            return this.commandsCache[name];
        }
    });

    module.exports = AdaptationEngine;
})();