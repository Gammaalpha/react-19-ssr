const path = require("path");
const nodeExternals = require('webpack-node-externals');
const { commonConfig } = require("./webpack.common");

module.exports = {
    ...commonConfig,
    entry: './src/server/index.ts',
    target: 'node',
    output: {
        filename: 'server.bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader"
            },
            // tsx
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ]
    },
    externalsPresets: { node: true },
    externals: {
        express: 'commonjs express' // example: avoid bundling express
    },
    // resolve: {
    //     extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    // }
}