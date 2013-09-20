var AbstractGroup   = require('kevoree-entities').AbstractGroup,
    log             = require('npmlog'),
    WSClient        = require('ws'),
    WSServer        = require('ws').Server,

    TAG         = 'WebSocketGroup',
    PULL        = 0,
    PUSH        = 1,
    REGISTER    = 3;

/**
 * WebSocketGroup: Kevoree group that handles model transfers through WebSocket protocol
 *
 * @type {WebSocketGroup}
 */
var WebSocketGroup = AbstractGroup.extend({
    toString: TAG,

    construct: function () {
        log.heading = 'kevoree';

        this.server = null;
        this.client = null;
    },

    start: function (_super) {
        _super.call(this);

        // assert('one and only one master server defined between all subnodes')
        this.checkNoMultipleMasterServer();

        if (this.dictionary.getValue('port') != undefined) {
            this.server = startWSServer(this.dictionary.getValue('port'));
        } else {
            log.warn(TAG, "There is no 'port' attribute defined: trying with default 8000");
            this.server = startWSServer(8000);
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

var startWSServer = function startWSServer(port) {
    // create a WebSocket server on specified port
    var server = new WSServer({port: port});
    log.info(TAG, "WebSocket server started: %s:%s", server.options.host, port);

    server.on('connection', function(ws) {
        ws.on('message', function(data, flag) {
            if (flag.binary == undefined) {
                // received data is a String
                log.info(TAG, "received %s", data);

            } else {
                // received data is binary
                log.info(TAG, "received binary data");
            }
        });
    });

    return server;
}

module.exports = WebSocketGroup;