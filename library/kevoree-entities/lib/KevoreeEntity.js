var Class       = require('pseudoclass'),
    Dictionary  = require('./Dictionary');

/**
 * Abstract class: KevoreeEntity
 * You are not supposed to instantiate this class manually. It makes no sense
 * You should create your own Kevoree entity that extend one of the defined abstraction type:
 * <ul>
 *     <li>AbstractNode</li>
 *     <li>AbstractGroup</li>
 *     <li>AbstractChannel</li>
 *     <li>AbstractComponent</li>
 * </ul>
 * All this sub-classes extend KevoreeEntity in order to have the same basic prototype
 *
 * @type {KevoreeEntity}
 */
module.exports = Class({
    toString: 'KevoreeEntity',

    construct: function () {
        this.kCore = null;
        this.dictionary = new Dictionary();
        this.name = null;
        this.path = null;
        this.nodeName = null;
    },

    start: function () {},

    stop: function () {},

    setKevoreeCore: function (kCore) {
        this.kCore = kCore;
    },

    getKevoreeCore: function () {
        return this.kCore;
    },

    getDictionary: function () {
        return this.dictionary;
    },

    getName: function () {
        return this.name;
    },

    getNodeName: function () {
        return this.nodeName;
    },

    setName: function (name) {
        this.name = name;
    },

    setPath: function (path) {
        this.path = path;
    },

    getPath: function () {
        return this.path;
    },

    setNodeName: function (name) {
        this.nodeName = name;
    },

    getModelEntity: function () {
        return this.kCore.getCurrentModel().findByPath(this.path);
    }
});