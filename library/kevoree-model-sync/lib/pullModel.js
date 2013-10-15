var bootstrapHelper = require('./bootstrapHelper');

/**
 *
 * @param model
 * @param targetNodeName
 * @param callback
 */
module.exports = function pullModel(model, targetNodeName, callback) {
  bootstrapHelper(model, targetNodeName, function (err, grp) {
    if (err) return callback(err);

    try {
      grp.pull(targetNodeName, function (err, model) {
        if (err) return callback(err);
        return callback(null, model);
      });
    } catch (err) {
      return callback(err);
    }
  });
}