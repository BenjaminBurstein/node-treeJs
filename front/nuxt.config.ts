// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
    head: {
        title: 'Wizard',
        htmlAttrs: {
            lang: 'fr',
        },
        meta: [
            {charset: 'utf-8'},
            {hid: 'description', name: 'description', content: ''},
            {
                name: 'viewport',
                content:
                    'width=device-width, initial-scale=1, viewport-fit=cover',
            },
            {hid: 'og:type', property: 'og:type', content: 'website'},
            {hid: 'author', name: 'author', content: 'Equipe 4'},
        ],
    },
    build: {
        loaders: {
            sass: {
                implementation: require('sass'),
            },
            scss: {
                implementation: require('sass'),
            },
            transpile: [
                'three'
            ],
        },
    },
    css: ['~/assets/scss/base/_font.css','~/assets/scss/main.scss'],
    components: [
        '~/components',
    ],
    plugins: [],
    pages: true,
    modules: [
        '@nuxtjs/tailwindcss',
    ],
    dir: {
        assets: 'assets',
    }
}
