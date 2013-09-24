var Class   = require('pseudoclass');

/**
 * Abstract AdaptationPrimitive command
 *
 * @param node JavascriptNode context
 * @param mapper ModelObjectMapper that handles mapping betweend model objects and 'real-life' object
 * @type {AdaptationPrimitive}
 */
module.exports = Class({
    toString: 'AdaptationPrimitive',

    /**
     * Construct an AdaptationPrimitive object
     *
     * @param node KevoreeNode platform
     * @param mapper ModelObjectMapper
     * @param model model to deploy (that triggers adaptations)
     * @param trace command related trace
     */
    construct: function (node, mapper, model, trace) {
        this.node = node;
        this.mapper = mapper;
        this.adaptModel = model;
        this.trace = trace;
    },

    /**
     * Executes adaption primitive logics
     * @param callback Function(err, [args]) if err != null => something went wrong
     */
    execute: function (callback) {
        if (callback == undefined || callback == null || typeof(callback) != 'function') {
            console.error("Execute method need a callback function as last parameter");
            return;
        }
    },

    /**
     * Undo the process done by execute()
     */
    undo: function (callback) {
        if (callback == undefined || callback == null || typeof(callback) != 'function') {
            console.error("Undo method need a callback function as last parameter");
            return;
        }
    }
});