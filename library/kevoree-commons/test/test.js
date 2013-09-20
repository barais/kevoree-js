var Logger = require('../kevoree-commons').KevoreeLogger;

var log = new Logger('TAG');
log.info('Foo %s:%s', 'bar', 'baz');
log.error("Something went wrong !");
log.debug('Si si \n%j', {la: 'famille'});