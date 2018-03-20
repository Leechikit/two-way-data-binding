module.exports = {
    parser: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-px2rem': {
            remUnit: 75
        },
        'postcss-cssnext': {}, // 增加前缀
        'cssnano': {} // 压缩
    }
}