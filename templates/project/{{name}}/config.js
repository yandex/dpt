// Plugins
var docs = require('dpt-docs');

// Compilers
var less = require('dpt/lib/compilers/less');
var stylus = require('dpt/lib/compilers/stylus');
var bml = require('dpt/lib/compilers/bml');
var babel = require('dpt/lib/compilers/babel');
var bmlhtml = require('dpt/lib/compilers/bmlhtml');

// Config
module.exports = {
    name: '{{name}}',
    port: 3010,
    // repository: '',

    plugins: [
        docs
    ],

    compilers: [
        {
            test: /\.less$/,
            use: less
        },
        {
            test: /\.styl$/,
            use: stylus
        },
        {
            test: /\.js$/,
            use: [bml, babel]
        },
        {
            test: /\.bml.html$/,
            use: bmlhtml
        }
    ]
}
