'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dedent = dedent;
function dedent(str) {
    var lines = str.split('\n');

    if (!lines[0]) {
        lines.shift();
    }

    var indentWidth = 0;
    while (lines[0][indentWidth] === ' ') {
        indentWidth++;
    }

    var result = '';

    for (var i in lines) {
        result += lines[i].substr(indentWidth);
        result += '\n';
    }

    return result;
}