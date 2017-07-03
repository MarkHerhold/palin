'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;
var palin = require('./palin');

const date = new Date(2000, 11, 11, 11, 11, 11, 111);
const message = 'trace message';
const aggObj = {
    file: '/Users/Mark/projects/palin/test/test.js',
    line: '9'
};

suite
    .add('formatter', function() {
        palin({}, 'trace', date, [message, aggObj]);
    })
    .on('cycle', function(event) {
    /*eslint no-console: 0*/
        console.log(String(event.target));
    })
// run async
    .run({ 'async': true });
