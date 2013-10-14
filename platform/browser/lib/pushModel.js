var bootstrapHelper = require('./bootstrapHelper');

module.exports = function pushModel(model, targetNodeName, callback) {
  bootstrapHelper(model, targetNodeName, function (err, grp) {
    if (err) return callback(err);

    console.log("BEFORE PUSH");
    grp.push(model, targetNodeName);
    console.log("AFTER PUSH");
    return callback();
  });
}