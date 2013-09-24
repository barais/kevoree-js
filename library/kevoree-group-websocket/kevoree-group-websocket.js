var AbstractGroup   = require('kevoree-entities').AbstractGroup,
    KevoreeLogger   = require('kevoree-commons').KevoreeLogger,
    WSClient        = require('ws'),
    WSServer        = require('ws').Server,

    PULL        = 0,
    PUSH        = 1,
    REGISTER    = 3;

/**
 * WebSocketGroup: Kevoree group that handles model transfers through WebSocket protocol
 *
 * @type {WebSocketGroup}
 */
var WebSocketGroup = AbstractGroup.extend({
    toString: 'WebSocketGroup',

    construct: function () {
        this.log = new KevoreeLogger(this.toString());

        this.server = null;
        this.client = null;
    },

    start: function (_super) {
        _super.call(this);

        // assert('one and only one master server defined between all subnodes')
        this.checkNoMultipleMasterServer();

        if (this.dictionary.getValue('port') != undefined) {
            this.server = startWSServer(this.log, this.dictionary.getValue('port'));
        } else {
            this.log.warn("There is no 'port' attribute defined: trying with default 8000");
            this.server = startWSServer(this.log, 8000);
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
            for (var i=0; i < group.subNodes.size(); i++) {
                var node        = group.subNodes.get(i),
                    dicValues   = node.dictionary.values;
                for (var j=0; j < dicValues.size(); j++) {
                    if (dicValues.get(j).attribute.name == 'port') {
                        var val = dicValues.get(j).value;
                        if (val && val != null && val.length > 0) portDefined++;
                    }
                }
            }

            if (portDefined > 1) {
                throw new Error("WebSocketGroup error: multiple master server defined. You are not supposed to specify more than ONE port attribute on this group sub nodes.");
            }
        }
    }
});

var startWSServer = function startWSServer(log, port) {
    // create a WebSocket server on specified port
    var server = new WSServer({port: port});
    log.info("WebSocket server started: %s:%s", server.options.host, port);

    server.on('connection', function(ws) {
        ws.on('message', function(data, flag) {
            if (flag.binary == undefined) {
                // received data is a String
                log.info("received %s", data);

            } else {
                // received data is binary
                log.info("received binary data");
            }
        });
    });

    return server;
}

module.exports = WebSocketGroup;