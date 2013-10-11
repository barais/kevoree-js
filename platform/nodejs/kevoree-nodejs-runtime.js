var config        = require('./config.json'),
    NodeJSRuntime = require('./lib/NodeJSRuntime');

// TODO enable install dir path in command-line
var kRuntime = new NodeJSRuntime();

// Kevoree Runtime started event listener
kRuntime.on('started', function (err) {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    // Kevoree Core is started, deploy model
    // TODO enable bootstrap model from path in command-line
    kRuntime.deploy();
});

// Kevoree Runtime deployed event listener
kRuntime.on('deployed', function (err, model) {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }

    // Kevoree Core has deployed a new model successfully

});

// Kevore Runtime error event listener
kRuntime.on('error', function (err) {
    console.error(err);
    process.exit(1);
});


kRuntime.start(config.nodeName);