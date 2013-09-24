var HTTPBootstrapper = require('../lib/HTTPBootstrapper');

var bsp = new HTTPBootstrapper('../');

bsp.bootstrapNodeType('node0', {}, function (err) {
    if (err) {
        console.log("Fail bootstrap");
        console.error(err);
        return;
    }

    console.log("bootstrap done");
})