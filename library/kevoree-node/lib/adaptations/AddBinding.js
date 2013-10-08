var AdaptationPrimitive = require('./AdaptationPrimitive'),
    RemoveBinding       = require('./RemoveBinding');

module.exports = AdaptationPrimitive.extend({
    toString: 'AddBinding',

    execute: function (_super, callback) {
        _super.call(this, callback);

        var mBinding = this.adaptModel.findByPath(this.trace.previousPath);

        if (mBinding.port.eContainer().eContainer().name == this.node.getName()) {
            // this binding is related to the current node platform
            var chanInstance = this.mapper.getObject(mBinding.hub.path()),
                compInstance = this.mapper.getObject(mBinding.port.eContainer().path());

            if (chanInstance && compInstance) {
                try {
                    var provided = mBinding.port.eContainer().provided;
                    for (var i=0; i < provided.size(); i++) {
                        var portInstance = this.mapper.getObject(provided.get(i).path());
                        portInstance.setComponent(compInstance);
                        portInstance.setChannel(chanInstance);

                        compInstance.addInternalInputPort(portInstance);
                        chanInstance.addInternalInputPort(portInstance);

                        var remoteNodeNames = [];
                        var relatedHubBindings = mBinding.hub.bindings;
                        for (var j=0; j < relatedHubBindings.size(); j++) {
                            if (relatedHubBindings.get(j).port != provided.get(i)) {
                                remoteNodeNames.push(relatedHubBindings.get(j).port.eContainer().eContainer().name);
                            }
                        }
                        chanInstance.addInternalRemoteNodes(provided.get(i).path(), remoteNodeNames);
                    }

                    var required = mBinding.port.eContainer().required;
                    for (var i=0; i < required.size(); i++) {
                        var portInstance = this.mapper.getObject(required.get(i).path());
                        portInstance.setComponent(compInstance);
                        portInstance.setChannel(chanInstance);

                        compInstance.addInternalOutputPort(portInstance);

                        var remoteNodeNames = [];
                        var relatedHubBindings = mBinding.hub.bindings;
                        for (var j=0; j < relatedHubBindings.size(); j++) {
                            if (relatedHubBindings.get(j).port != required.get(i)) {
                                remoteNodeNames.push(relatedHubBindings.get(j).port.eContainer().eContainer().name);
                            }
                        }
                        chanInstance.addInternalRemoteNodes(required.get(i).path(), remoteNodeNames);
                    }

                    return callback();

                } catch (err) {
                    return callback(err);
                }

            } else {
                return callback(new Error("AddBinding error: unable to find channel or component instance(s)."));
            }
        }

        return callback();
    },

    undo: function (_super, callback) {
        _super.call(this, callback);
        callback.call(this, null);
    }
});