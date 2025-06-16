const path = require("path");
const nodeExternals = require('webpack-node-externals');
const { commonConfig } = require("./webpack.common");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    ...commonConfig,
    entry: './src/server/index.ts',
    target: 'node',
    output: {
        filename: 'server.bundle.js',
        path: path.resolve(__dirname, 'build'),
        // clean: true, // only need it once since this file runs first
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },
            // tsx
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: [/node_modules/],
            },
            {
                test: /\.scss$/,
                use: 'null-loader', // stub out SCSS on the server
            },
        ]
    },
    externalsPresets: { node: true },
    externals: [nodeExternals(), 'commonjs', 'express'], // Prevent bundling node_modules
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@client': path.resolve(__dirname, 'src/client')
        },
    },
    plugins: [
        // new CleanWebpackPlugin(), // Only cleans build/server
    ]
}