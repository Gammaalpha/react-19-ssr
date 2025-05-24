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
                loader: "babel-loader",
                // include: path.resolve(__dirname, 'src/client'), // Only include client code
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
                include: path.resolve(__dirname, 'src/client'), // Only include client code
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
            // SCSS Modules
            // {
            //     test: /\.module\.scss$/,
            //     use: [
            //         'style-loader', // Injects styles into DOM
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 modules: true,
            //             },
            //         },
            //         'sass-loader', // Compiles Sass to CSS
            //     ],
            // },
            // Global SCSS (non-module)
            // {
            //     test: /\.scss$/,
            //     exclude: /\.module\.scss$/,
            //     use: ['style-loader', 'css-loader', 'sass-loader'],
            // },
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
    ],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            '@server': false, // Prevent accidental server imports
        },
    }
}