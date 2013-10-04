var Core                    = require('kevoree-core'),
    JSONModelLoader         = require('kevoree-library').org.kevoree.loader.JSONModelLoader,
    KevoreeBrowserLogger    = require('./lib/KevoreeBrowserLogger'),
    HTTPBootstrapper        = require('./lib/BrowserBootstrapper'),
    jsonModel               = require('./testModel.json');

var log = new KevoreeBrowserLogger('Runtime');

// init core objects
var kevoreeCore     = new Core(__dirname, log),
    jsonLoader      = new JSONModelLoader(),
    model           = jsonLoader.loadModelFromString(JSON.stringify(jsonModel)).get(0),
    bootstrapper    = new HTTPBootstrapper(__dirname);

// init DOM objects
var startBtn    = $('#start-btn'),
    deployBtn   = $('#deploy-btn'),
    started     = false,
    deployed    = false,
    deploying   = false;

kevoreeCore.on('started', function () {
    log.info("KevoreeCore started");
    started = true;
    startBtn.addClass("disabled");
    deployBtn.removeClass("disabled");
});

kevoreeCore.on('deployed', function (err, model) {
    deploying = false;
    deployed = true;
    deployBtn.popover('hide');
    deployBtn.removeClass("disabled");
    log.info("KevoreeCore deployed");
});

kevoreeCore.on('stopped', function (err, model) {
    log.info("KevoreeCore stopped");
    started = deployed = deploying = false;
    startBtn.removeClass("disabled");
});

kevoreeCore.on('error', function (err) {
    log.error("KevoreeCore "+err.message);
    try {
        // try to stop Kevoree Core on error
        kevoreeCore.stop();
    } catch (err) {
        started = deployed = deploying = false;
    }
});

//set Kevoree bootstrapper
kevoreeCore.setBootstrapper(bootstrapper);

// start Kevoree Core
startBtn.on('click', function () {
    if (!started) {
        try {
            kevoreeCore.start('node0');
        } catch (err) {
            log.error(err.message);
        }

    } else log.warn();
});

deployBtn.on('click', function () {
    if (started) {
        if (!deploying) {
            if (!deployed) {
                try {
                    deploying = true;
                    deployBtn.addClass("disabled");
                    deployBtn.popover({
                        html: true,
                        content: deployPopoverContent,
                        placement: 'bottom',
                        trigger: 'manual'
                    });
                    deployBtn.popover('show');
                    kevoreeCore.deploy(model);
                } catch (err) {
                    log.error(err.message);
                }
            } else {
                log.warn("Model is already deployed.");
            }
        } else {
            log.warn("Already trying to deploy model, please wait...");
        }
    } else {
        log.warn("Can't deploy model: you must start Kevoree Runtime first.");
    }
});

var deployPopoverContent = function deployPopoverContent() {
    return '<small>Please wait while deploying...</small>' +
           '<div class="progress progress-striped active" style="margin-bottom: 0px">'+
             '<div class="progress-bar progress-bar-info"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>' +
           '</div>';
}
