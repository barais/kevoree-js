var bootstrapHelper = require('./bootstrapHelper');

/**
 *
 * @param model
 * @param targetNodeName
 * @param callback
 */
module.exports = function pushModel(model, targetNodeName, callback) {
  bootstrapHelper(model, targetNodeName, function (err, grp) {
    if (err) return callback(err);

    grp.push(model, targetNodeName);
    return callback();
  });
}