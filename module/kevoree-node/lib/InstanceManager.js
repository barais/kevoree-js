;(function () {
    var Class   = require('pseudoclass'),
        Log     = require('log');

    var InstanceManager = Class({
        toString: 'InstanceManager',
        construct: function () {
            this.logger = new Log(this.toString());

            this.instances = {};
            this.deployUnits = {};
        },

        addInstance: function (name, instance) {
            this.instances[name] = instance;
        },

        removeInstance: function (name) {
            if (this.instances[name]) {
                delete this.instances[name];
            }
        },

        addDeployUnit: function (kmfId, moduleName) {
            this.deployUnits[kmfId] = moduleName;
        },

        removeDeployUnit: function (kmfId) {
            if (this.deployUnits[kmfId]) {
                delete this.deployUnits[kmfId];
            }
        },

        getInstances: function () {
            return this.instances;
        },

        getDeployUnits: function () {
            return this.deployUnits;
        },

        getDeployUnit: function (kmfId) {
            return this.deployUnits[kmfId];
        },

        hasDeployUnit: function (kmfId) {
            return (this.deployUnits[kmfId] != undefined && this.deployUnits[kmfId] != null);
        }
    });

    module.exports = InstanceManager;
})();