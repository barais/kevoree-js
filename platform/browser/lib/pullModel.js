var bootstrapHelper = require('./bootstrapHelper');

module.exports = function pullModel(model, targetNodeName, callback) {
  bootstrapHelper(model, targetNodeName, function (err, grp) {
    if (err) return callback(err);

    grp.pull(targetNodeName, function (err, model) {
      if (err) return callback(err);
      return callback(null, model);
    });
  });
}