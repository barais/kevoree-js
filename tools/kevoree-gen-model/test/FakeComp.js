var AbstractComponent = require('kevoree-entities').KevoreeEntity;

var FakeComp = AbstractComponent.extend({
    toString: 'FakeComp',

    start: function () {
        console.log("fake comp start");
    },

    stop: function () {
        console.log("fake comp stop");
    }
});

module.exports = FakeComp;