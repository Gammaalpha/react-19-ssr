const path = require("path");
const { commonConfig } = require("./webpack.common");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    ...commonConfig,
    entry: './src/client/index.tsx',
    target: "web",
    output: {
        filename: 'client.bundle.js',
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
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ],
                include: /\.module\.scss$/
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                loader: "url-loader",
                options: { limit: false },
            },
            { test: /\.css$/, use: ["style-loader", "css-loader"] }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                // { from: "public" }, // don't include index.html from public with current SSR setup
                { from: "assets" }
            ]
        }),
    ]
}