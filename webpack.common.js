const systemMode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const commonConfig = {
    mode: systemMode,
    devtool: systemMode === 'development' ? 'source-map' : undefined
}

module.exports = {
    commonConfig
}