var KevoreeEntity = require('kevoree-entities').KevoreeEntity;
var kevoree = require('kevoree-library').org.kevoree;

/**
 * Generates dictionary and adds it to given typeDef
 * @param typeDef
 * @param obj
 * @returns {DictionaryType}
 */
module.exports = function (typeDef, obj) {
    var factory = new kevoree.impl.DefaultKevoreeFactory();

    // create a new dictionary
    var dictionary = factory.createDictionaryType();

    for (var prop in obj) {
        if (prop.startsWith(KevoreeEntity.DIC)) {
            // retrieve object's attribute
            var objAttr = obj[prop] || {};

            // create a dictionary attribute
            var attr = factory.createDictionaryAttribute();
            attr.name               = prop.replace(KevoreeEntity.DIC, '');
            attr.optional           = objAttr.optional || true;
            attr.state              = objAttr.state;
            attr.datatype           = objAttr.datatype;
            attr.fragmentDependant  = objAttr.fragmentDependant || false;

            // add attribute to dictionary
            dictionary.addAttributes(attr);

            // add a defaultValue to attribute only if defined by user
            // 'null' is a defaultValue, but "undefined" is not a defaultValue =)
            if (typeof(objAttr.defaultValue) !== 'undefined') {
                // create a dictionary default value
                var defaultVal = factory.createDictionaryValue();
                defaultVal.value = objAttr.defaultValue;
                defaultVal.attribute = attr;

                // add defaultVal to dictionary
                dictionary.addDefaultValues(defaultVal);
            }
        }
    }

    // add dictionary to typeDef
    typeDef.dictionaryType = dictionary;

    return dictionary;
}