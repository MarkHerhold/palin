'use strict';

var expect = require('chai').expect;
var getTimestampString = require('./../palin')._getTimestampString;
var stripAnsi = require('strip-ansi');

describe('getTimestampString formatting', function () {
    it('should format dates with small millisecond values correctly', function () {
        var string = stripAnsi(getTimestampString(new Date('2016-08-09T21:34:26.000Z')));
        expect(string).to.contain(':000');
    });

    it('should format dates with small millisecond values correctly', function () {
        var string = stripAnsi(getTimestampString(new Date('2016-08-09T21:34:26.001Z')));
        expect(string).to.contain(':001');
    });

    it('should format dates with large millisecond values correctly', function () {
        var string = stripAnsi(getTimestampString(new Date('2016-08-09T21:34:26.999Z')));
        expect(string).to.contain(':999');
    });
});
