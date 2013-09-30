var KevoreeLogger = require('kevoree-commons').KevoreeLogger;

var logDOM  = document.querySelector('#log-console'),
    ERROR   = 0,
    WARN    = 1,
    DEBUG   = 2,
    INFO    = 3;

/**
 * DOM logger
 * @param level
 * @param tag
 * @param msg
 */
var addLogToDOM = function addLogToDOM(level, tag, msg) {
    var tr      = document.createElement('tr'),
        timeTd  = document.createElement('td'),
        tagTd   = document.createElement('td'),
        msgTd   = document.createElement('td');

    switch (level) {
        case DEBUG:
            tr.className += ' success';
            break;

        case INFO:
            tr.className += ' primary';
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

/**
 * Console logger
 * @param level
 * @param tag
 * @param msg
 */
var addLogToConsole = function addLogToConsole(level, tag, msg) {
    switch (level) {
        case DEBUG:
            console.info(tag+': '+msg);
            break;

        case INFO:
            console.log(tag+': '+msg);
            break;

        case ERROR:
            console.error(tag+': '+msg);
            break;

        case WARN:
            console.warn(tag+': '+msg);
            break;
    }
}

// determine which logger to use
var logger = (function () {
    if (logDOM != null) {
        return addLogToDOM;
    } else {
        return addLogToConsole;
    }
})();

/**
 * KevoreeBrowserLogger redefines KevoreeLogger in order to show logs wether in browser's console
 * or by finding a #log-console ID in the DOM.
 * @type {KevoreeBrowserLogger} extend KevoreeLogger
 */
var KevoreeBrowserLogger = KevoreeLogger.extend({
    toString: 'KevoreeBrowserLogger',

    info: function (msg) {
        logger(INFO, this.tag, msg);
    },

    warn: function (msg) {
        logger(WARN, this.tag, msg);
    },

    debug: function (msg) {
        logger(DEBUG, this.tag, msg);
    },

    error: function (msg) {
        logger(ERROR, this.tag, msg);
    }
});

var getTimeFormatted = function getTimeFormatted() {
    var time = new Date;
    return time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+':'+time.getMilliseconds();
}

module.exports = KevoreeBrowserLogger;