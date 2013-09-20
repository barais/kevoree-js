var Core                    = require('kevoree-core'),
    JSONModelLoader         = require('kevoree-library').org.kevoree.loader.JSONModelLoader,
    KevoreeBrowserLogger    = require('./lib/KevoreeBrowserLogger');

var log = new KevoreeBrowserLogger('Runtime');

// init core objects
var kevoreeCore = new Core(__dirname, log),
    jsonLoader  = new JSONModelLoader(),
    model       = jsonLoader.loadModelFromString(JSON.stringify(require('./model.json'))).get(0);

// init DOM objects
var startBtn    = document.getElementById('start-btn'),
    deployBtn   = document.getElementById('deploy-btn'),
    started     = false;

kevoreeCore.on('started', function () {
    log.info("KevoreeCore started");
    started = true;
    startBtn.className += " disabled";
});

kevoreeCore.on('deployed', function (err, model) {
    log.info("KevoreeCore deployed");
});

kevoreeCore.on('stopped', function (err, model) {
    log.info("KevoreeCore stopped");
    started = false;
});

kevoreeCore.on('error', function (err) {
    log.error("KevoreeCore "+err.message);
    try {
        // try to stop Kevoree Core on error
        kevoreeCore.stop();
    } catch (err) {
        started = false;
    }
});

// set Kevoree bootstrapper
//kevoreeCore.setBootstrapper(bootstrapper);

// start Kevoree Core
startBtn.addEventListener('click', function () {
    if (!started) {
        try {
            kevoreeCore.start('node0');
        } catch (err) {
            log.error(err.message);
        }

    } else log.warn();
});

deployBtn.addEventListener('click', function () {
    if (started) {
        try {
            kevoreeCore.deploy(model);
        } catch (err) {
            log.error(err.message);
        }

    } else log.warn("Can't deploy model: you must start Kevoree Runtime first.");
});
