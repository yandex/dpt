// Plugins
var docs = require('dpt-docs');

// Compilers
var less = require('dpt/lib/compilers/less');
var stylus = require('dpt/lib/compilers/stylus');
var js = require('dpt/lib/compilers/js');
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
            compiler: less
        },
        {
            test: /\.styl$/,
            compiler: stylus
        },
        {
            test: /\.js$/,
            compiler: js
        },
        {
            test: /\.bml.html$/,
            compiler: bmlhtml
        }
    ]
}
