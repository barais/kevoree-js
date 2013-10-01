var Class               = require('pseudoclass'),
    kLib                = require('kevoree-library'),
    ModelObjectMapper   = require('./ModelObjectMapper'),
    KevoreeLogger       = require('kevoree-commons').KevoreeLogger;

// Adaptation Primitives
var AddInstance         = require('./adaptations/AddInstance'),
    AddBinding          = require('./adaptations/AddBinding'),
    AddDeployUnit       = require('./adaptations/AddDeployUnit'),
    AddTypeDef          = require('./adaptations/AddTypeDef'),
    Noop                = require('./adaptations/Noop'),
    RemoveBinding       = require('./adaptations/RemoveBinding'),
    RemoveDeployUnit    = require('./adaptations/RemoveDeployUnit'),
    RemoveInstance      = require('./adaptations/RemoveInstance'),
    RemoveTypeDef       = require('./adaptations/RemoveTypeDef'),
    StartInstance       = require('./adaptations/StartInstance'),
    StopInstance        = require('./adaptations/StopInstance'),
    UpdateDictionary    = require('./adaptations/UpdateDictionary');


// CONSTANTS
var ADD_INSTANCE_TRACE  = [
        'org.kevoree.Group',
        'org.kevoree.Node',
        'org.kevoree.ComponentInstance',
        'org.kevoree.Channel'
    ],
    ADD_DEPLOY_UNIT     = [
        'org.kevoree.DeployUnit'
    ],
    COMMAND_RANK = {
        "StopInstance":     0,
        "RemoveBinding":    1,
        "RemoveInstance":   2,
        "RemoveTypeDef":    3,
        "RemoveDeployUnit": 4,
        "AddDeployUnit":    5,
        "AddTypeDef":       6,
        "AddInstance":      7,
        "AddBinding":       8,
        "UpdateDictionary": 9,
        "StartInstance":    10,
        "Noop":             42
    };

/**
 * AdaptationEngine knows each AdaptationPrimitive command available
 * for JavascriptNode.
 * Plus, it handles model - object mapping
 *
 * @type {AdaptationEngine}
 */
var AdaptationEngine = Class({
    toString: 'AdaptationEngine',

    construct: function (node) {
        this.log = new KevoreeLogger(this.toString());

        this.node = node;
        this.modelObjMapper = new ModelObjectMapper();

        // cache commands once loaded to prevent using require() multiple times
        this.commandsCache = {};
    },

    /**
     * Process traces to find the right adaptation primitive command
     * Returns a command to execute in order to do the adaptation logic
     * @param traces
     * @param model
     * @returns {Array}
     */
    processTraces: function (traces, model) {
        var cmdList = [];
        for (var i=0; i < traces.size(); i++) {
            cmdList.push(this.processTrace(traces.get(i), model));
        }

        return this.sortCommands(cmdList);
    },

    /**
     *
     * @param trace
     * @returns {AddInstance, AddDeployUnit, AddBinding, AdaptationPrimitive, Noop, UpdateDictionary}
     */
    processTrace: function (trace, model) {
        //console.log(JSON.stringify(JSON.parse(trace), null, 2));

        // ADD TRACES HANDLING
        if (isType(trace, kLib.org.kevoree.modeling.api.trace.ModelAddTrace)) {
            if (ADD_INSTANCE_TRACE.indexOf(trace.typeName) != -1) {
                // Add instance
                return new AddInstance(this.node, this.modelObjMapper, model, trace);

            } else if (ADD_DEPLOY_UNIT.indexOf(trace.typeName) != -1) {
                // Add deploy unit
                return new AddDeployUnit(this.node, this.modelObjMapper, model, trace);

            } else if (trace.refName == 'mBindings') {
                // Add binding
                return new AddBinding(this.node, this.modelObjMapper, model, trace);
            }

        // SET TRACES HANDLING
        } else if (isType(trace, kLib.org.kevoree.modeling.api.trace.ModelSetTrace)) {
            if (trace.refName && trace.refName == "started") {
                var AdaptationPrimitive = (trace.content == 'true') ? StartInstance : StopInstance;
                return new AdaptationPrimitive(this.node, this.modelObjMapper, model, trace);

            } else if (trace.refName && trace.refName == 'value') {
                return new UpdateDictionary(this.node, this.modelObjMapper, model, trace);
            }

        } else if (isType(trace, kLib.org.kevoree.modeling.api.trace.ModelRemoveTrace)) {
            // TODO
        } else if (isType(trace, kLib.org.kevoree.modeling.api.trace.ModelAddAllTrace)) {
            // TODO
        } else if (isType(trace, kLib.org.kevoree.modeling.api.trace.ModelRemoveAllTrace)) {
            // TODO
        }

        // Unhandled trace command
        return new Noop(this.node, this.modelObjMapper, model, trace);
    },

    sortCommands: function (list) {
        list.sort(function (a, b) {
            if (COMMAND_RANK[a.toString()] > COMMAND_RANK[b.toString()]) return 1;
            else if (COMMAND_RANK[a.toString()] < COMMAND_RANK[b.toString()]) return -1;
            else return 0;
        });

        return list;
    }
});

var isType = function (object, type) {
    if (object === null || object === undefined) {
        return false;
    }

    var proto = Object.getPrototypeOf(object);
    if (proto == type.proto) {
        return true;
    }
    return false;
}

module.exports = AdaptationEngine;