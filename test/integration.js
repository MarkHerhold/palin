'use strict';

var log = require('bristol');
var palin = require('./../palin');
const options = {
    indent: '\n   ⇒ ',
    rootFolderName: 'palin'
};
log.addTarget('console').withFormatter(palin, options);

describe('formatter', function() {
    it('should be able to log#trace()', function() {
        log.trace("This little thing happened", { scope: 'scope:trace' });
    });

    it('should be able to log#debug()', function() {
        log.debug("Debug log message", { scope: 'scope:debug' });
    });

    it('should be able to log#info()', function() {
        log.info("We're up and running!", { scope: 'scope:log' });
    });

    it('should be able to log#warn()', function() {
        log.warn("Oh snap!", { warning: 'this isn\'t good', error: false });
    });

    it('should be able to log#error()', function() {
        log.error("Oh noes!", { ohCrap: true });
    });

    it('should be able to log#error() with an Error object', function() {
        log.error("Message with error object", new Error('Something blew up'));
    });

    it('should be able to log#error() with multiple Error objects', function() {
        log.error('oh, snap!', new Error('Error 1'), new Error('Error 2'), [ 'thing', 123 ], { data: true }, { scope: 'controller' });
    });
});
