var AbstractComponent = require('kevoree-entities').AbstractComponent;

var FakeComp = AbstractComponent.extend({
    toString: 'FakeComp',

    start: function () {
        console.log("fake comp start");
    },

    stop: function () {
        console.log("fake comp stop");
    },

    out_potato: null,

    in_fake: function (msg) {

    },

    in_receiver: function (msg) {

    }
});

module.exports = FakeComp;