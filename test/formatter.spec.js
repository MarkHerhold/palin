var expect = require('chai').expect;
var palin = require('./../palin');
var chalk = require('chalk');

describe('formatter', function() {
    it('should format a single "trace" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'trace message';
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin({}, 'trace', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 TRACE trace message (/Users/Mark/projects/palin/test/test.js:9)');
    });

    it('should format a single "debug" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'debug message';
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin({}, 'debug', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 DEBUG debug message (/Users/Mark/projects/palin/test/test.js:9)');
    });

    it('should format a single "info" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'info message';
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin({}, 'info', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 INFO info message (/Users/Mark/projects/palin/test/test.js:9)');
    });

    it('should format a single "log" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'log message';
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin({}, 'log', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 LOG log message (/Users/Mark/projects/palin/test/test.js:9)');
    });

    it('should format a single "warning" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'warning message';
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin({}, 'warn', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 WARN warning message (/Users/Mark/projects/palin/test/test.js:9)');
    });

    it('should format a single "error" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'error message';
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin({}, 'error', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 ERROR error message (/Users/Mark/projects/palin/test/test.js:9)');
    });

    // Test for derrived errors - see https://github.com/MarkHerhold/palin/issues/1
    it('should format a derived "error" message', function() {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'error message';

        function DerivedError() {
            Error.call(this);
        }
        DerivedError.prototype = new Error();
        DerivedError.prototype.constructor = DerivedError;

        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };

        const result = palin({}, 'error', date, [message, new DerivedError(), aggObj]);
        expect(chalk.stripColor(result)).to.contain('  11:11:11:111 ERROR error message (/Users/Mark/projects/palin/test/test.js:9)\n    →  [Error]\n    →  Error\n    →      at');
    });

    describe('timestamp option', function() {
        it('should not include a timestamp with the timestamp option set to false', function() {
            const message = 'hello';
            const options = {
                timestamp: false
            };
            const aggObj = {
                file: '/Users/Mark/projects/palin/test/test.js',
                line: '9'
            };
            const result = palin(options, 'log', new Date(), [message, aggObj]);
            expect(chalk.stripColor(result)).to.equal('  LOG hello (/Users/Mark/projects/palin/test/test.js:9)');
        });

        it('should include a timestamp with a custom timestamp function', function() {
            const message = 'hello';
            const options = {
                timestamp: function(date) {
                    // the formatter should pass in a date
                    expect(date).to.be.a('date');
                    return 'sometime:today';
                }
            };
            const aggObj = {
                file: '/Users/Mark/projects/palin/test/test.js',
                line: '9'
            };
            const result = palin(options, 'log', new Date(), [message, aggObj]);
            expect(chalk.stripColor(result)).to.equal('  sometime:today LOG hello (/Users/Mark/projects/palin/test/test.js:9)');
        });
    });

    describe('rootFolderName option', function () {
        const date = new Date(2000, 11, 11, 11, 11, 11, 111);
        const message = 'hello';
        const options = {
            rootFolderName: 'palin'
        };
        const aggObj = {
            file: '/Users/Mark/projects/palin/test/test.js',
            line: '9'
        };
        const result = palin(options, 'log', date, [message, aggObj]);
        expect(chalk.stripColor(result)).to.equal('  11:11:11:111 LOG hello (test/test.js:9)');
    });
});
