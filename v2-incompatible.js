const {createPlugin} = require('@sanity/incompatible-plugin')
const manifest = require('./package.json')

module.exports = createPlugin(manifest.name)
