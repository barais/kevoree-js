var KevoreeCore             = require('kevoree-core'),
    JSONModelLoader         = require('kevoree-library').org.kevoree.loader.JSONModelLoader,
    KevoreeBrowserLogger    = require('./lib/KevoreeBrowserLogger'),
    HTTPBootstrapper        = require('./lib/BrowserBootstrapper');

var log = new KevoreeBrowserLogger('Runtime');

// init core objects
var kevoreeCore     = new KevoreeCore(__dirname, log),
    jsonLoader      = new JSONModelLoader(),
    bootstrapper    = new HTTPBootstrapper(__dirname);

// init DOM objects
var startBtn    = $('#start-btn'),
    deployBtn   = $('#deploy-btn'),
    nodeName    = $('#node-name'),
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
    log.error(err.message);
    deploying = deployed = false;
    deployBtn.popover('hide');
    deployBtn.removeClass("disabled");
    try {
        // try to stop Kevoree Core on error
        kevoreeCore.stop();
    } catch (err) {
        started = deployed = deploying = false;
    }
});

//set Kevoree bootstrapper
kevoreeCore.setBootstrapper(bootstrapper);

// start Kevoree Core button clicked
startBtn.on('click', function () {
    if (!started) {
        try {
            var nodename = nodeName.val() || "node0";
            kevoreeCore.start(cleanString(nodename));
            nodeName.prop('disabled', 'disabled');
        } catch (err) {
            log.error(err.message);
        }

    } else log.warn();
});

// deploy button clicked
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

                    $.ajax({
                        type: 'GET',
                        url: '/bootstrap',
                        data: {nodename: kevoreeCore.getNodeName()},
                        success: function (data) {
                            kevoreeCore.deploy(jsonLoader.loadModelFromString(data.model).get(0));
                        },
                        error: function (err) {
                            console.error(err);
                            log.error('Unable to retrieve bootstrap model from server. Aborting deploy.');
                            deploying = false;
                            deployBtn.removeClass('disabled');
                            deployBtn.popover('hide');
                        }
                    });
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

var cleanString = function cleanString(str) {
    str = str.replace(/\s/g, '');
    str = str.replace(/[^\w\d]/g, '');
    return str;
}
