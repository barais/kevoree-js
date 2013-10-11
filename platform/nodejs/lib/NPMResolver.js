var Resolver    = require('kevoree-commons').Resolver,
    npm         = require('npm'),
    path        = require('path');

var NPMResolver = Resolver.extend({
    toString: 'NPMResolver',

    construct: function (modulesPath) {
        this.modulesPath = modulesPath;
    },

    resolve: function (deployUnit, callback) {
        var resolver = this;

        npm.load({}, function (err) {
            if (err) {
                callback(new Error('Unable to load npm module'));
                return;
            }

            var packageName     = deployUnit.unitName,
                packageVersion  = deployUnit.version;

            // load success
            npm.commands.install(resolver.modulesPath, [packageName+'@'+packageVersion], function installCallback(err) {
                if (err) {
                    console.error('npm failed to install package %s:%s', packageName, packageVersion);
                    callback(new Error("Bootstrap failure"));
                    return;
                }

                // install sucess
                var KClass = require(path.resolve(resolver.modulesPath, 'node_modules', packageName));
                callback(null, KClass);
                return;
            });
        });
    },

    uninstall: function (deployUnit, callback) {
        var resolver = this;

        npm.load({}, function (err) {
            if (err) {
                // npm load error
                callback(new Error('RemoveDeployUnit error: unable to load npm module'));
                return;
            }

            var packageName     = deployUnit.unitName,
                packageVersion  = deployUnit.version;

            // load success
            npm.commands.uninstall(resolver.modulesPath, [packageName+'@'+packageVersion], function uninstallCallback(er) {
                if (er) {
                    // failed to load package:version
                    callback.call(new Error('RemoveDeployUnit failed to uninstall '+packageName+':'+packageVersion));
                    return;
                }

                callback.call(null);
                return;
            });
        });
    }
});

module.exports = NPMResolver;