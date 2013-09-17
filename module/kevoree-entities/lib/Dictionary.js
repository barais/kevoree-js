var Class           = require('pseudoclass'),
    EventEmitter    = require('events').EventEmitter;


var Dictionary = Class({
    toString: 'Dictionary',

    construct: function () {
        this.emitter = new EventEmitter();
        this.map = {};
        this.length = 0;
    },

    on: function (event, callback) {
        this.emitter.addListener(event, callback);
    },

    off: function (event, callback) {
        this.emitter.removeListener(event, callback);
    },

    getValue: function (name) {
        return this.map[name];
    },

    setEntry: function (name, value) {
        if (this.map[name] != undefined) {
            // an entry with the same name already exists in the dictionary
            var oldValue = this.map[name];
            this.map[name] = value;
            // emit update event with the name, oldValue and newValue
            this.emitter.emit('update', name, oldValue, value);

        } else {
            // no entry with that name exists in the dictionary : add it
            this.map[name] = value;
            this.length++;
            // emit an add event with the entry
            this.emitter.emit('add', name, value);
        }
    },

    setMap: function (map) {
        if (this.length > 0) {
            // current map is not empty
            for (var newName in map) {
                var alreadyAdded = false;

                for (var name in this.map) {
                    if (newName == name) {
                        // oldMap and newMap both have this attribute : update needed ?
                        var oldValue = this.map[name];
                        if (oldValue != map[name]) {
                            // map[name] value is different from current value => update
                            this.map[name] = map[name];
                            this.emitter.emit('update', name, oldValue, this.map[name]);
                        }
                        alreadyAdded = true;
                    }
                }

                if (!alreadyAdded) {
                    // newMap has a new attribute to add to currentMap : ADD event
                    this.map[newName] = map[newName];
                    this.emitter.emit('add', newName, this.map[newName]);
                }
            }

        } else {
            // dictionary was empty : set it from scratch
            this.map = map;

            // compute map length
            for (var name in this.map) this.length++;

            // emit add event for each value added in the dictionary
            for (var name in this.map) this.emitter.emit('add', name, this.map[name]);
        }
    },

    clone: function () {
        var clonedMap = {};
        for (var name in this.map) {
            clonedMap[name] = this.map[name];
        }
        return clonedMap;
    }
});

module.exports = Dictionary;