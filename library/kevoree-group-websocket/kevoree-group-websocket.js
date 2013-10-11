var AbstractGroup   = require('kevoree-entities').AbstractGroup,
    KevoreeLogger   = require('kevoree-commons').KevoreeLogger,
    kevoree         = require('kevoree-library').org.kevoree,
    WSServer        = require('ws').Server,

    PULL        = 0,
    PUSH        = 1,
    REGISTER    = 3,
    PULL_JSON   = 42;

/**
 * WebSocketGroup: Kevoree group that handles model transfers through WebSocket protocol
 *
 * @type {WebSocketGroup}
 */
var WebSocketGroup = AbstractGroup.extend({
    toString: 'WebSocketGroup',

    // START Dictionary attributes =====
    dic_port: {
        fragmentDependant: true,
        optional: true
    },
    // END Dictionary attributes =====

    construct: function () {
        this.log = new KevoreeLogger(this.toString());

        this.server = null;
        this.client = null;
        this.connectedNodes = {};
    },

    start: function (_super) {
        _super.call(this);

        // assert('one and only one master server defined between all subnodes')
        this.checkNoMultipleMasterServer();

        if (this.dictionary.getValue('port') != undefined) {
            this.server = this.startWSServer(this.dictionary.getValue('port'));
        } else {
            this.log.debug("There is no 'port' attribute defined: starting a WebSocket client on this node");
            this.client = this.startWSClient();
        }
    },

    stop: function (_super) {
        _super.call(this);

        if (this.server != null) {
            this.server.stop();
        }

        if (this.client != null) {
            this.client.stop();
        }
    },

    update: function (_super) {
        _super.call(this);

        this.stop();
        this.start();
    },

    push: function (model, targetNodeName) {
        //
    },

    pull: function (targetNodeName) {
        // TODO
    },

    checkNoMultipleMasterServer: function () {
        var group = this.getModelEntity();
        if (group != null) {
            var portDefined = 0;
            var dicVals = group.dictionary.values.iterator();
            while (dicVals.hasNext()) {
                var val = dicVals.next();
                if (val.attribute.name == 'port') {
                    if (typeof(val.value) !== 'undefined' && val.value != null && val.value.length > 0) {
                        portDefined++;
                    }
                }
            }

            if (portDefined > 1) {
                throw new Error("WebSocketGroup error: multiple master server defined. You are not supposed to specify more than ONE port attribute on this group sub nodes.");

            } else if (portDefined == 0) {
                throw new Error("WebSocketGroup error: no master server defined. You should specify a node to be the master server (in order to do that, give to a node a value to its 'port' attribute)");

            } else {
                // all good
                return;
            }
        }

        throw new Error("WebSocketGroup error: Unable to find group instance in model (??)");
    },

    startWSServer: function (port) {
        // create a WebSocket server on specified port
        var server = new WSServer({port: port});
        this.log.info("WebSocket server started: "+ server.options.host+":"+port);

        server.on('connection', function(ws) {
            ws.on('message', function(data, flag) {
                if (flag.binary == undefined) {
                    // received data is a String
                    this.processMessage(ws, data);

                } else {
                    // received data is binary
                    this.processMessage(ws, String.fromCharCode.apply(null, new Uint8Array(data)));
                }
            });
        });

        return server;
    },

    startWSClient: function () {
        var masterServerAddress = this.getMasterServerAddress();
        if (typeof(masterServerAddress) !== 'undefined' && masterServerAddress != null) {
            var group = this;

            var ws = new WebSocket('ws://'+masterServerAddress);
            ws.on('open', function() {
                ws.send(REGISTER+group.getNodeName());
            });

            ws.on('message', function (data) {
                var jsonLoader = new kevoree.loader.JSONModelLoader();
                var model = jsonLoader.loadModelFromString(data);
                group.kCore.deploy(model);
            });

            ws.on('close', function () {
                group.log.debug("WebSocketGroup client: connection closed with ws://"+masterServerAddress);
            })
        } else {
            throw new Error("There is no master server in your model. You must specify a master server by giving a value to one port attribute.");
        }
    },

    getMasterServerAddress: function () {
        var ret = [],
            port = null;

        var kGroup = this.getModelEntity();
        if (typeof(kGroup) !== 'undefined' && kGroup != null) {
            var subNodes = kGroup.subNodes.iterator();
            while (subNodes.hasNext()) {
                var node = subNodes.next();
                if (node.dictionary != null) {
                    var values = node.dictionary.values.iterator();
                    while (values.hasNext()) {
                        var value = values.next();
                        if (value.attribute.name == 'port') {
                            port = value.value;
                            var nodeNetworks = this.getDeployModel().nodeNetworks.iterator();
                            while (nodeNetworks.hasNext()) {
                                var links = nodeNetworks.next().link.iterator();
                                while (links.hasNext()) {
                                    var netProps = links.next().networksProperties.iterator();
                                    while (netProps.hasNext()) {
                                        ret.push(netProps.next().value+':'+port);
                                    }
                                }
                            }
                            break; // we don't need to process other attributes we were looking for 'port' that's all
                        }
                    }
                }
            }
        } else {
            throw new Error("WebSocketGroup error: Unable to find group instance in model (??)");
        }

        // if no address found, give it a try locally
        if (ret.length == 0) ret.push('127.0.0.1:'+port);

        return ret;
    },

    processMessage: function (clientSocket, data) {
        var controlByte = data[0],
            realData    = data.slice(1, data.length);

        switch (controlByte) {
            case PUSH:
                this.onMasterServerPush(clientSocket, realData);
                break;

            case PULL:
                this.onMasterServerPull(clientSocket, realData);
                break;

            case PULL_JSON:
                this.onMasterServerPullJSON(clientSocket, realData);
                break;

            case REGISTER:
                this.onMasterServerRegister(clientSocket, realData);
                break;

            default:
                this.log.error("Received control byte '"+controlByte+"': WebSocketGroup is unable to process this control byte");
                break;
        }
    },

    onMasterServerPush: function (clientSocket, strData) {
        this.log.info("WebSocketGroup: "+clientSocket._socket.address()+" asked for a PUSH");

        var jsonLoader = new kevoree.loader.JSONModelLoader();
        var model = jsonLoader.loadModelFromString(strData).get(0);

        this.kCore.deploy(model);

        // broadcast model over all connected nodes
        for (var nodeName in this.connectedNodes) {
            this.connectedNodes[nodeName].send(strData);
        }
    },

    onMasterServerPull: function (clientSocket, strData) {
        this.log.info("WebSocketGroup: "+clientSocket._socket.address()+" asked for a PULL (xmi)");

        var serializer = new kevoree.serializer.XMIModelSerializer();
        var strModel = serializer.serialize(this.kCore.getCurrentModel());
        clientSocket.send(strModel);
    },

    onMasterServerPullJSON: function (clientSocket, strData) {
        this.log.info("WebSocketGroup: "+clientSocket._socket.address()+" asked for a PULL (json)");

        var serializer = new kevoree.serializer.JSONModelSerializer();
        var strModel = serializer.serialize(this.kCore.getCurrentModel());
        clientSocket.send(strModel);
    },

    onMasterServerRegister: function (clientSocket, nodeName) {
        this.connectedNodes[nodeName] = clientSocket;
        this.log.info("WebSocketGroup: "+clientSocket._socket.address()+" new registered client.");
    }
});

module.exports = WebSocketGroup;