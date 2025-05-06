const commonConfig = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
            {
                test: /\.css$/i,
                loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                loader: 'asset/resource'
            },
        ]
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
    }
}

module.exports = {
    commonConfig
}