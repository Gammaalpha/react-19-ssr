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
                include: path.resolve(__dirname, 'src/client'), // Only include client code
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
                test: /\.module\.s[ac]ss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    {
                        loader: "css-loader",
                        options: {
                            modules: false
                        }
                    },
                    // Compiles Sass to CSS
                    "sass-loader"
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /\.module\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][hash][ext][query]', // or 'assets/[name][ext]'
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
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