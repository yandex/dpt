var webpack = require('webpack');

var env = new webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'BROWSER': JSON.stringify(true)
    }
});

module.exports = {
    entry: {
        loader: './src/loader/loader.js'
    },
    output: {
        path: __dirname + "/lib/bundles/",
        filename: "[name].js"
    },
    module: {
        loaders: [{
                test: /\.js$/,
                loader: 'babel'
            },
            {
                test: /\.less$/,
                loader: 'style?singleton!css!autoprefixer!less'
            }
        ]
    },
    plugins: [env]
};