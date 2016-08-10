'use strict';

var util = require('util'); // node's util
var chalk = require('chalk');
var check = require('check-types');

// shortens the file name to exclude any path before the project folder name
// @param path: file path string. e.g. /home/mark/myproj/run.js
// @param rootFolderName: root folder for the project. e.g. "myproj"
// @return the shortened file path string
function truncFilename(path, rootFolderName) {
    // bail if a string wasn't provided
    if (typeof path !== 'string') {
        return path;
    }

    var index = path.indexOf(rootFolderName);
    if (index > 0) {
        return path.substring(index + rootFolderName.length + 1);
    } else {
        return path;
    }
}

// retruns the colorized timestamp string
function getTimestampString(date) {
    // all this nasty code is faster (~30k ops/sec) than doing "moment(date).format('HH:mm:ss:SSS')" and means 0 dependencies
    var hour = '0' + date.getHours();
    hour = hour.slice(hour.length - 2);
    var minute = '0' + date.getMinutes();
    minute = minute.slice(minute.length - 2);
    var second = '0' + date.getSeconds();
    second = second.slice(second.length - 2);
    var ms = '' + date.getMilliseconds();

    // https://github.com/MarkHerhold/palin/issues/6
    // this is faster than using an actual left-pad algorithm
    if (ms.length === 1) {
        ms = '00' + ms;
    } else if (ms.length === 2) {
        ms = '0' + ms;
    } // no modifications for 3 or more digits

    return chalk.dim(`${hour}:${minute}:${second}:${ms}`);
}

const severityMap = {
    error: 'bgRed',
    warn: 'bgYellow',
    info: 'white',
    debug: 'white',
    trace: 'white'
};

// returns the colorized text for the given severity level
function getColorSeverity(severity) {
    // get the color associated with the severity level
    const color = severityMap[severity] || 'white';
    return chalk[color].bold(severity.toUpperCase());
}

var prevColor = 0; // keep track of the previous scope color
const colors = [/*'black',*/ 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];
var scopeColorMap = {};
function getScopeColor(scope) {
    if (scopeColorMap[scope]) {
        return scopeColorMap[scope];
    } else {
        var color = colors[prevColor++ % colors.length];
        scopeColorMap[scope] = color;
        return color;
    }
}
// returns the colorized scope string
function getScopeString(scope) {
    return chalk[getScopeColor(scope)].bold(scope);
}

// default indentation string. Lives here so it is not recomputed every time formatter() is called
const defaultIndent = chalk.gray('\n    →  ');

// the formatter to export
var formatter = function formatter(options, severity, date, elems) {

    /*
    OPTIONS
    */
    const indent = options.indent || defaultIndent;
    const timestamp = (function () {
        if (check.function(options.timestamp)) {
            return options.timestamp; // user-provided timestamp generating function
        } else if (options.timestamp === false) {
            return false; // no timestamp
        } else {
            return getTimestampString; // default timestamp generating function
        }
    })();
    const rootFolderName = options.rootFolderName;

    /*
    LOGIC
    */

    // the last element is an aggregate object of all of the additional passed in elements
    var aggObj = elems[elems.length - 1];

    // initial log string
    var build = ' ';

    // add the date
    if (timestamp !== false) {
        // otherwise, use the default timestamp generator function
        build += ' ' + timestamp(date);
    }

    build += ' ' + getColorSeverity(severity) + ' ';

    // add the component if provided
    if (aggObj.scope) {
        build += getScopeString(aggObj.scope) + ' ';
        delete aggObj.scope;
    }

    // errors are a special case that we absolutely need to keep track of and log the entire stack
    var errors = [];

    for (let i = 0; i < elems.length - 1; i++) { // iterate through all elements in the array except the last (obj map of options)
        let element = elems[i];

        // Attempt to determine an appropriate title given the first element
        if (i === 0) {
            let elementConsumed = false;
            if (check.string(element)) {
                // string is obviously the title
                build += chalk.blue(element);
                elementConsumed = true;
            } else if (check.builtIn(element, Error)) {
                // title is the error text representation
                build += chalk.blue(element.message || '[no message]');
                // also store error stacktrace in the aggregate object
                errors.push(element);
                elementConsumed = true;
            }

            // add on the file and line number, which always go after the title, inline
            if (aggObj.file && aggObj.line) {
                aggObj.file = truncFilename(aggObj.file, rootFolderName);
                build += chalk.dim(` (${aggObj.file}:${aggObj.line})`);
                delete aggObj.file;
                delete aggObj.line;
            }

            // do not add element 0 to the 'extra' data section
            if (elementConsumed) {
                continue;
            }
        }

        // add the element to the errors array if it's an error
        if (check.builtIn(element, Error)) {
            errors.push(element);
            // the error will be concatinated later so continue to the next element
            continue;
        }

        let objString = '\n' + util.inspect(element, { colors: true });
        build += objString.replace(/\n/g, indent);
    }

    if (Object.keys(aggObj).length > 0) {
        let objString = '\n' + util.inspect(aggObj, { colors: true });
        build += objString.replace(/\n/g, indent);
    }

    // iterate through the top-level object keys looking for Errors as well
    for (let o of Object.keys(aggObj)) {
        if (check.builtIn(o, Error)) {
            errors.push(o);
        }
    }

    // iterate through all the Error objects and print the stacks
    for (let e of errors) {
        build += indent + e.stack.replace(/\n/g, indent);
    }

    return build;
};

module.exports = formatter;
// further exports for testing
formatter._getTimestampString = getTimestampString;
