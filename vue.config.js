const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }
    },
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'))
    }
}
