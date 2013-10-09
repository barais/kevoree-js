var AbstractGroup = require('kevoree-entities').AbstractGroup;
var kevoree = require('kevoree-library').org.kevoree;

/**
 * Generates group
 * @param deployUnit
 * @param obj
 * @param model
 */
module.exports = function (deployUnit, obj, model) {
    var factory = new kevoree.impl.DefaultKevoreeFactory();

    // create a new group type
    var groupType = factory.createGroupType();
    groupType.name = obj.toString();

    // add super type if not AbstractGroup
    var superType = obj.superPrototype.toString();
    if (superType != 'AbstractGroup') groupType.superTypes.add(superType);

    // add deployUnit
    groupType.addDeployUnits(deployUnit);

    model.addTypeDefinitions(groupType);

    return groupType;
}