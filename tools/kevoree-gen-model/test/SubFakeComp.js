var FakeComp = require('./FakeComp');

var SubFakeComp = FakeComp.extend({
    toString: 'SubFakeComp',

    start: function () {
        console.log("sub fake comp start");
    },

    stop: function () {
        console.log("stop fake comp stop");
    }
});

module.exports = SubFakeComp;