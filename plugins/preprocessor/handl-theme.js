'use strict'
class Theme {
    constructor(options = {}) {
        this.options = Object.assign(options, Theme.DEF_OPT)
    }
    process(css, extra) {
        var {
            theme,
            placehoder,
            themePath
        } = this.options
        if (!theme) {
            return css
        }
        var hasChange = false
        css = css.replace(placehoder, function() {
            hasChange = true
            return `@import '${themePath}/${theme}.less';\n`
        })
        return css
    }
}

Theme.DEF_OPT = {
    placehoder: /^\s*?\/{2}\s*\@__IMPORT_THEME;$/gm,
    themePath: './theme'
}

function LessPluginTheme(options) {
    this.options = options;
}

LessPluginTheme.prototype = {
    install: function(less, pluginManager) {
        pluginManager.addPreProcessor(new Theme(this.options))
    },
    setOptions: function(options) {
        this.options = options
    },
    minVersion: [2, 1, 0]
}

module.exports = LessPluginTheme