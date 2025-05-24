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
                loader: "babel-loader",
                // exclude: path.resolve(__dirname, 'src/client'), // Only include server code
                // include: path.resolve(__dirname, 'src/server'), // Only include server code
            },
            // tsx
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                exclude: [/node_modules/],
                // include: path.resolve(__dirname, './src/server'), // Only include server code
            },
        ]
    },
    externalsPresets: { node: true },
    // externals: {
    //     express: 'commonjs express' // example: avoid bundling express
    // },
    externals: [nodeExternals()], // Prevent bundling node_modules
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            '@client': false, // Prevent accidental client imports
        },
    }
}