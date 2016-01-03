'use strict';

var log = require('bristol');
var palin = require('./../palin');
const options = {
    indent: '\n   ⇒ ',
    rootFolderName: 'palin'
};
log.addTarget('console').withFormatter(palin, options);

log.trace("This little thing happened", { scope: 'scope:trace' });
log.debug("Debug log message", { scope: 'scope:debug' });
log.info("We're up and running!", { scope: 'scope:log' });
log.warn("Oh snap!", { warning: 'this isn\'t good', error: false });
log.error("Oh noes!", { ohCrap: true });
log.error("Message with error object", new Error('Something blew up'));
