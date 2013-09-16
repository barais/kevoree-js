;(function () {
    var Class   = require('pseudoclass'),
        log     = require('npmlog');

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
            log.heading = 'kevoree';

            this.kCore = null;
            this.dictionary = null;
        },

        start: function () {
            log.info(this.toString(), "start");
        },

        stop: function () {
            log.info(this.toString(), "stop");
        },

        update: function () {
            log.info(this.toString(), "update");
        },

        setKevoreeCore: function (kCore) {
            this.kCore = kCore;
        },

        getKevoreeCore: function () {
            return this.kCore;
        },

        updateDictionary: function (dict) {
            this.dictionary = dict;
        },

        getDictionary: function () {
            return this.dictionary;
        }
    });
})();