const { defineConfig } = require( '@vue/cli-service' );
module.exports = defineConfig( {
    transpileDependencies: ['quasar'],

    lintOnSave: false,

    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false,
        },
    },

    publicPath: process.env.NODE_ENV === 'production' ?
        '/computational-geometry-tasks' :
        '/',
} );
