;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        npm                 = require('npm'),
        path                = require('path');

    /**
     * AddInstance Adaptation command
     * @param trace diff trace associated to this command
     * @param model model to deploy
     */
    module.exports = AdaptationPrimitive.extend({
        toString: 'AddInstance Adaptation',

        setTypeDefinition: function (td) {
            this.typeDef = td;
        },

        execute: function (callback) {
            console.log("AddInstance Primitive started....");
            if (callback == undefined || callback == null || typeof(callback) != 'function') {
                console.error("AddInstance error: execute method need a callback function as last parameter");
                return;
            }

            var deployUnits = this.typeDef.getDeployUnits(),
                that = this;
            if (deployUnits.size() > 0) {
                // TODO FIX THIS
                var du = deployUnits.get(0);
                if (du != undefined && du != null) {
                    var packageName     = du.getUnitName(),
                        packageVersion  = du.getVersion();

                    // install deployUnit
                    npm.load({}, function (err) {
                        if (err) {
                            // npm load error
                            callback.call(that, new Error('AddInstance error: unable to load npm module'));
                            return;
                        }

                        // load success
                        var modulesPath = that.node.getKevoreeCore().getModulesPath();
                        npm.commands.install(modulesPath, [packageName+'@'+packageVersion], function (er) {
                            if (er) {
                                // failed to load package:version

                                callback.call(that, new Error('AddInstance failed to load '+packageName+':'+packageVersion));
                                return;
                            }

                            // install sucess
                            var InstanceClass = require(path.resolve(modulesPath, 'node_modules', packageName));
                            var instance = new InstanceClass();
                            instance.start();
                            callback.call(that, null);
                            return;
                        });
                    });
                }

            } else {
                // TODO error no deploy unit to install instance
                callback.call(this, new Error('AddInstance error: no deploy unit found to install '+td.getName()));
                return;
            }
        },

        undo: function () {
            // TODO
        }
    });
})();