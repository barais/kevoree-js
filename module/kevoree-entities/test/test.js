var AbstractNode        = require('../kevoree-entities').AbstractNode,
    AbstractChannel     = require('../kevoree-entities').AbstractChannel,
    AbstractComponent   = require('../kevoree-entities').AbstractComponent,
    AbstractGroup       = require('../kevoree-entities').AbstractGroup;

var entities = [
    new AbstractNode(),
    new AbstractChannel(),
    new AbstractComponent(),
    new AbstractGroup()
];

for (var i in entities) {
    console.log('New entity: '+entities[i].toString());
    entities[i].start();
    entities[i].stop();
}
