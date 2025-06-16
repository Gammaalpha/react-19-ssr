const path = require("path");
const { commonConfig } = require("./webpack.common");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    ...commonConfig,
    entry: './src/client/index.tsx',
    target: "web",
    output: {
        // filename: 'client.bundle.js',
        path: path.resolve(__dirname, 'build/client'),
        filename: '[name].[contenthash].js', // This allows multiple chunks with different names
        chunkFilename: '[name].[contenthash].js', // For async chunks
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript'
                        ]
                    }
                }
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
        new CleanWebpackPlugin(), // Only cleans build/client
        new CopyWebpackPlugin({
            patterns: [
                // { from: "public" }, // don't include index.html from public with current SSR setup
                { from: "assets" }
            ]
        }),
        {
            apply: (compiler) => {
                compiler.hooks.done.tap('WriteChunksJsonPlugin', (stats) => {
                    const json = stats.toJson({
                        modules: false,
                        chunks: false,
                        relatedAssets: true,
                        chunkGroups: true,
                        entrypoints: false,
                        assets: false,
                        warnings: false,
                        chunkGroupAuxiliary: false
                    });

                    fs.writeFileSync(
                        path.resolve(__dirname, 'build/webpack-stats.json'),
                        JSON.stringify(json, null, 2)
                    );

                    console.log('[webpack] chunks.json written to build/');
                });
            },
        },
    ],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            // '@server': false, // Prevent accidental server imports
            '@server': path.resolve(__dirname, 'src/server'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@client': path.resolve(__dirname, 'src/client')
        },
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                shared: {
                    name: 'shared',
                    chunks: 'all',
                    test: /[\\/]src[\\/]shared[\\/]/,
                    enforce: true
                }
            }
        }
    },
}