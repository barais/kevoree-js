var npm     = require('npm'),
    path    = require('path'),
    kevoree = require('kevoree-library').org.kevoree;

var loader = new kevoree.loader.JSONModelLoader();

/**
 *
 * @param unitName
 * @param version
 * @param callback
 */
module.exports = function (unitName, version, callback) {
  try {
    // try to require.resolve model directly (this will work if the module has already been installed)
    require.resolve(unitName);
    var packageJson = require(path.resolve('node_modules', unitName, 'package.json'));
    if (packageJson.version == version) return model();
    else throw new Error('Version mismatch (wanted: '+version+', found: '+packageJson.version+')');

  } catch (err) {
    // module wasn't installed locally : let's do it
    console.log("getJSONModel: Reinstalling library (reason: %s)", err.message);
    npm.load({}, function (err) {
      if (err) return callback(err);

      npm.commands.install([unitName+'@'+version], function (err) {
        if (err) return callback(err);

        try {
          return model();

        } catch (err) {
          return callback(err);
        }
      })
    });
  }

  /**
   * Retrieves kevlib.json model, load it to a real ContainerRoot object
   * and call the callback method
   */
  function model() {
    var modelJson = require(path.resolve('node_modules', unitName, 'kevlib.json')),
      model = loader.loadModelFromString(JSON.stringify(modelJson)).get(0);
    callback(null, model);
  }
}