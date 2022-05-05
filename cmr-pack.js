const cmrPack = require('cmr-pack');
const path = require('path');

cmrPack.run({
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'build.js'
    },
    module: {
        rules: []
    },
    port: '4444'
});
