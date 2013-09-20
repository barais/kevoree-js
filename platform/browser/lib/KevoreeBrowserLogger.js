var KevoreeLogger = require('kevoree-utils').KevoreeLogger;

var logDOM  = document.getElementById('log-console'),
    ERROR   = 0,
    WARN    = 1,
    DEBUG   = 2,
    INFO    = 3;

var KevoreeBrowserLogger = KevoreeLogger.extend({
    toString: 'KevoreeBrowserLogger',

    info: function (_super, msg) {
        addLogToDOM(INFO, this.tag+': '+msg);
    },

    warn: function (_super, msg) {
        addLogToDOM(WARN, this.tag+': '+msg);
    },

    debug: function (_super, msg) {
        addLogToDOM(DEBUG, this.tag+': '+msg);
    },

    error: function (_super, msg) {
        addLogToDOM(ERROR, this.tag+': '+msg);
    }
});

var addLogToDOM = function (level, msg) {
    var li = document.createElement('li');

    switch (level) {
        // TODO add level
        case DEBUG:
            li.className += ' text-primary';
            break;

        case INFO:
            li.className += ' text-success';
            break;

        case ERROR:
            li.className += ' text-danger';
            break;

        case WARN:
            li.className += ' text-warning';
            break;
    }

    li.innerHTML = msg;
    logDOM.appendChild(li);
}

module.exports = KevoreeBrowserLogger;