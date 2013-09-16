;(function () {
    var AdaptationPrimitive = require('./AdaptationPrimitive'),
        log                 = require('npmlog'),

        TAG                 = 'UpdateDictionary';

    module.exports = AdaptationPrimitive.extend({
        toString: TAG,

        setInstance: function (inst) {
            this.instance = inst;
        },

        execute: function (_super, callback) {
            _super.call(this, callback);

            var dictionary = {};

            // fill dictionary with default values if any
            if (this.instance.getTypeDefinition().getDictionaryType() != null) {
                var defaultValues = this.instance.getTypeDefinition().getDictionaryType().getDefaultValues();
                if (defaultValues != null) {
                    for (var i=0; i < defaultValues.size(); i++) {
                        dictionary[defaultValues.get(i).getName()] = defaultValues.get(i).getValue();
                    }
                }
            }

            // fill dictionary with current instance attribute values
            if (this.instance.getDictionary() != null) {
                var values = this.instance.getDictionary().getValues();
                for (var i=0; i < values.size(); i++) {
                    var val = values.get(i);
                    if (val.getAttribute().getFragmentDependant() == true) {
                        var targetNode = val.getTargetNode();
                        if (targetNode != null) {
                            if (targetNode.getName() == this.node.getName()) {
                                dictionary[val.getAttribute().getName()] = val.getValue();
                            }
                        }
                    } else {
                        dictionary[val.getAttribute().getName()] = val.getValue();
                    }
                }
            }

            var instance = this.instanceManager.getInstance(this.instance.getName());
            if (instance != undefined && instance != null) {
                instance.updateDictionary(dictionary);
                callback.call(this, null);
                return;

            } else {
                callback.call(this, new Error("Unable to UpdateDictionary: instance does not exist"));
                return;
            }
        },

        undo: function (_super, callback) {
            _super.call(this, callback);
            callback.call(this, null);
        }
    });
})();