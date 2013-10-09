var AbstractChannel = require('kevoree-entities').AbstractChannel;
var kevoree = require('kevoree-library').org.kevoree;

/**
 * Generates channel
 * @param deployUnit
 * @param obj
 * @param model
 */
module.exports = function (deployUnit, obj, model) {
    var factory = new kevoree.impl.DefaultKevoreeFactory();

    // create a new group type
    var chanType = factory.createChannelType();
    chanType.name = obj.toString();

    // add super type if not AbstractGroup
    var superType = obj.superPrototype.toString();
    if (superType != 'AbstractChannel') chanType.superTypes.add(superType);

    // add deployUnit
    chanType.addDeployUnits(deployUnit);

    model.addTypeDefinitions(chanType);

    return chanType;
}