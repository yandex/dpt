export function dedent(str) {
    let lines = str.split('\n');

    if (!lines[0]) {
        lines.shift();
    }

    let indentWidth = 0;
    while (lines[0][indentWidth] === ' ') {
        indentWidth++;
    }

    let result = '';

    for (let i in lines) {
        result += lines[i].substr(indentWidth);
        result += '\n';
    }

    return result;
}