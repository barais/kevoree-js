var KevoreeLogger = require('kevoree-commons').KevoreeLogger;

var logDOM  = document.getElementById('log-console'),
    ERROR   = 0,
    WARN    = 1,
    DEBUG   = 2,
    INFO    = 3;

var KevoreeBrowserLogger = KevoreeLogger.extend({
    toString: 'KevoreeBrowserLogger',

    info: function (_super, msg) {
        addLogToDOM(INFO, this.tag, msg);
    },

    warn: function (_super, msg) {
        addLogToDOM(WARN, this.tag, msg);
    },

    debug: function (_super, msg) {
        addLogToDOM(DEBUG, this.tag, msg);
    },

    error: function (_super, msg) {
        addLogToDOM(ERROR, this.tag, msg);
    }
});

var addLogToDOM = function (level, tag, msg) {
    var tr      = document.createElement('tr'),
        timeTd  = document.createElement('td'),
        tagTd   = document.createElement('td'),
        msgTd   = document.createElement('td');

    switch (level) {
        // TODO add level
        case DEBUG:
            tr.className += ' primary';
            break;

        case INFO:
            tr.className += ' success';
            break;

        case ERROR:
            tr.className += ' danger';
            break;

        case WARN:
            tr.className += ' warning';
            break;
    }

    timeTd.innerHTML = getTimeFormatted();
    tagTd.innerHTML = '<strong>'+tag+'</strong>';
    msgTd.innerHTML = msg;

    timeTd.className = 'time-td';
    tagTd.className = 'tag-td';

    tr.appendChild(timeTd);
    tr.appendChild(tagTd);
    tr.appendChild(msgTd);
    logDOM.appendChild(tr);
}

var getTimeFormatted = function getTimeFormatted() {
    var time = new Date;
    return time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+time.getMilliseconds();
}

module.exports = KevoreeBrowserLogger;