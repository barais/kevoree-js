var AbstractGroup   = require('kevoree-entities').AbstractGroup,
  KevoreeLogger   = require('kevoree-commons').KevoreeLogger,
  kevoree         = require('kevoree-library').org.kevoree,
  WebSocket       = require('ws'),
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
      this.server.close();
    }

    if (this.client != null) {
      this.client.close();
    }
  },

  update: function (_super) {
    _super.call(this);

    this.stop();
    this.start();
  },

  push: function (model, targetNodeName) {
    if (targetNodeName == this.getMasterServerNodeName()) {
      this.onServerPush(model, this.getMasterServerAddresses());
    } else {
      this.onClientPush(model, targetNodeName);
    }
  },

  pull: function (targetNodeName, callback) {
    if (targetNodeName == this.getMasterServerNodeName()) {
      // pull request is for the master server, forward the request to it
      this.onServerPull(this.getMasterServerAddresses(), callback);
    } else {
      // pull request is for a client node, forward the request to it
      this.onClientPull(targetNodeName, callback);
    }
  },

  onServerPush: function (model, addresses) {
    var ws = new WebSocket('ws://'+addresses[0]); // TODO change that => to try each different addresses not only the first one

    var onOpen = function onOpen() {
      var serializer = new kevoree.serializer.JSONModelSerializer();
      var modelStr = serializer.serialize(model);
      var binMsg = new Uint8Array(1+modelStr.length);
      binMsg[0] = PUSH;
      for (var i=0; i<modelStr.length; i++) {
        binMsg[i+1] = modelStr.charCodeAt(i);
      }
      ws.send(binMsg);
      ws.close();
    }

    if (ws.on) ws.on('open', onOpen);
    else ws.onopen = onOpen;
  },

  onClientPush: function (model, targetNodeName) {
    throw new Error("WebSocketGroup error: Push request can only be made on master server node (for now).");
  },

  onServerPull: function (addresses, callback) {
    var ws = new WebSocket('ws://'+addresses[0]); // TODO change that => to try each different addresses not only the first one

    var onOpen = function onOpen() {
      var binMsg = new Uint8Array(1);
      binMsg[0] = PULL_JSON;
      ws.send(binMsg);
    }

    var onMessage = function onMessage(data) {
      ws.close();

      // load model and give it back to the callback
      var jsonLoader = new kevoree.loader.JSONModelLoader();
      var model = jsonLoader.loadModelFromString(data).get(0);
      callback(null, model);
    }

    if (ws.on) {
      ws.on('open', onOpen);
      ws.on('message', onMessage);
    } else {
      ws.onopen = onOpen;
      ws.onmessage = onMessage;
    }
  },

  onClientPull: function (targetNodeName, callback) {
    callback(new Error("WebSocketGroup error: Pull request can only be made on master server node (for now)."));
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
    var self = this;
    var server = new WSServer({port: port});
    this.log.info("WebSocket server started: "+ server.options.host+":"+port);

    server.on('connection', function(ws) {
      ws.on('message', function(data, flag) {
        if (flag.binary == undefined) {
          // received data is a String
          self.processMessage(ws, data);

        } else {
          // received data is binary
          var bin = new Uint8Array(data);
          self.processMessage(ws, bin[0], String.fromCharCode.apply(null, bin.slice(1, bin.length)));
        }
      });
    });

    return server;
  },

  startWSClient: function () {
    var addresses = this.getMasterServerAddresses();
    if (typeof(addresses) !== 'undefined' && addresses != null && addresses.length > 0) {
      var group = this;

      var ws = new WebSocket('ws://'+addresses[0]); // TODO change that => to try each different addresses not only the first one

      var onOpen = function onOpen() {
        var binMsg = new Uint8Array(group.getNodeName().length+1);
        binMsg[0] = REGISTER;
        for (var i=0; i<group.getNodeName().length; i++) {
          binMsg[i+1] = group.getNodeName().charCodeAt(i);
        }
        ws.send(binMsg);
      }

      var onMessage = function onMessage(data) {
        var jsonLoader = new kevoree.loader.JSONModelLoader();
        var model = jsonLoader.loadModelFromString(data).get(0);
        group.kCore.deploy(model);
      }

      var onClose = function onClose() {
        group.log.debug("WebSocketGroup client: connection closed with ws://"+addresses.get(0));
      }

      if (ws.on) {
        ws.on('open', onOpen);
        ws.on('message', onMessage);
        ws.on('close', onClose);
      } else {
        ws.onopen = onOpen;
        ws.onmessage = onMessage;
        ws.onclose = onClose;
      }

    } else {
      throw new Error("There is no master server in your model. You must specify a master server by giving a value to one port attribute.");
    }
  },

  getMasterServerAddresses: function () {
    var ret = [],
      port = null;

    var kGroup = this.getModelEntity();
    if (typeof(kGroup) !== 'undefined' && kGroup != null) {
      var values = kGroup.dictionary.values.iterator();
      while (values.hasNext()) {
        var value = values.next();
        if (value.attribute.name == 'port') {
          port = value.value;
          if (typeof(port) !== 'undefined' && port != null && port.length > 0) {
            var nodeNetworks = this.kCore.getDeployModel().nodeNetworks.iterator();
            while (nodeNetworks.hasNext()) {
              var links = nodeNetworks.next().link.iterator();
              while (links.hasNext()) {
                if (typeof(links.next().networksProperties) !== 'undefined') {
                  var netProps = links.next().networksProperties.iterator();
                  while (netProps.hasNext()) {
                    ret.push(netProps.next().value+':'+port);
                  }
                }
              }
            }
            break; // we don't need to process other attributes we were looking for a valid 'port' that's all
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

  getMasterServerNodeName: function () {
    var ret = null;
    var group = this.getModelEntity();
    if (group != null) {
      if (group.dictionary.values && group.dictionary.values.size() > 0) {
        var dicVals = group.dictionary.values.iterator();
        while (dicVals.hasNext()) {
          var val = dicVals.next();
          if (val.attribute.name == 'port') {
            if (typeof(val.value) !== 'undefined' && val.value != null && val.value.length > 0) {
              ret = val.targetNode.name;
              break; // we can stop the looping there, we found the master server node name
            }
          }
        }
      }
    }
    return ret;
  },

  processMessage: function (clientSocket, controlByte, data) {
    switch (controlByte) {
      case PUSH:
        this.onMasterServerPush(clientSocket, data);
        break;

      case PULL:
        this.onMasterServerPull(clientSocket, data);
        break;

      case PULL_JSON:
        this.onMasterServerPullJSON(clientSocket, data);
        break;

      case REGISTER:
        this.onMasterServerRegister(clientSocket, data);
        break;

      default:
        this.log.error("Received control byte '"+controlByte+"': WebSocketGroup is unable to process this control byte");
        break;
    }
  },

  onMasterServerPush: function (clientSocket, strData) {
    this.log.info(clientSocket._socket.remoteAddress+":"+clientSocket._socket.remotePort+" asked for a PUSH");

    var jsonLoader = new kevoree.loader.JSONModelLoader();
    var model = jsonLoader.loadModelFromString(strData).get(0);

    this.kCore.deploy(model);

    // broadcast model over all connected nodes
    for (var nodeName in this.connectedNodes) {
      this.connectedNodes[nodeName].send(strData);
    }
  },

  onMasterServerPull: function (clientSocket, strData) {
    this.log.info(clientSocket._socket.remoteAddress+":"+clientSocket._socket.remotePort+" asked for a PULL (xmi)");

    var serializer = new kevoree.serializer.XMIModelSerializer();
    var strModel = serializer.serialize(this.kCore.getCurrentModel());
    clientSocket.send(strModel);
  },

  onMasterServerPullJSON: function (clientSocket, strData) {
    this.log.info(clientSocket._socket.remoteAddress+":"+clientSocket._socket.remotePort+" asked for a PULL (json)");

    var serializer = new kevoree.serializer.JSONModelSerializer();
    var strModel = serializer.serialize(this.kCore.getCurrentModel());
    clientSocket.send(strModel);
  },

  onMasterServerRegister: function (clientSocket, nodeName) {
    this.connectedNodes[nodeName] = clientSocket;
    this.log.info("New registered client '"+nodeName+"' ("+clientSocket._socket.remoteAddress+":"+clientSocket._socket.remotePort+")");
  }
});

module.exports = WebSocketGroup;