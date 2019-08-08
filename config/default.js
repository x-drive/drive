var argv = process.env

const plugins = {
    framwork: require('../plugins/postpackager/framework-conf'),
    rand: require('../plugins/preprocessor/rand'),
    genRouter: require('../plugins/postpackager/gen-router'),
    LessPluginTheme: require('../plugins/preprocessor/handl-theme'),
    babel: require('../plugins/parse/babel'),
    less: require('../plugins/parse/less'),
    inject: require('../plugins/preprocessor/inject')
}

const theme = argv.theme || fis.get('project.theme')
const THEME_PATH = '@theme/' + theme
// 是否开启 cdn
var CDN_DOMAIN = argv.CDN_DOMAIN
if (typeof fis.get('res.domain') !== 'undefined') {
    CDN_DOMAIN = fis.get('res.domain')
}
if (CDN_DOMAIN) {
    fis.set("project.domain", CDN_DOMAIN)
}
// 是否启用 hash
var RES_USEHASH = argv.RES_USE_HASH
if (typeof fis.get('res.useHash') !== 'undefined') {
    RES_USEHASH = fis.get('res.useHash')
}

fis.media("prod")
    .match("*.{css, less}", {
        "optimizer": fis.plugin("clean-css")
    })
    .match("*.png", {
        "optimizer": fis.plugin("png-compressor", {
            type: 'pngquant'
        })
    })
    .match("*.js", {
        "optimizer": fis.plugin("uglify-js", {
            "mangle": {
                "except": "exports, module, require, define"
            }
        })
    })
    .match('::package', {
        spriter: fis.plugin('csssprites')
    })

fis.match("*.less", {
    "parser": theme ? fis.plugin("less-2.x", {
        plugins: [new plugins.LessPluginTheme({
            theme
        })]
    }) : plugins.less
    ,"rExt": ".css"
})

if (fis.get('babel') === true) {
    fis.match("/components/(**.js)", {
        "parser": plugins.babel
    })
}

fis.match("/server/**.js", {
    "optimizer": null
    ,"isMod": false
    ,"useCompile": false
    ,"isJsLike": false
    ,"useCache": false
    ,"useHash": false
    ,"isJsLike": false
    ,"isCssLike": false
    ,"useMap": false
})
.match("/@server/(**)", {
    "isMod": false
    ,"optimizer": null
    ,"useCompile": false
    ,"isJsLike": false
    ,"useCache": false
    ,"useHash": false
    ,"isJsLike": false
    ,"isCssLike": false
    ,"useMap": false
    ,"release": "/server/$1"
})
.match("/@server/conf/(**)", {
    "optimizer": null
    ,"useCompile": false
    ,"isJsLike": false
    ,"useCache": false
    ,"useHash": false
    ,"isJsLike": false
    ,"isCssLike": false
    ,"useMap": false
    ,"release":"/server/conf/@conf/$1"
    ,"isMod": false
})
.match("/component_modules/(**.js)", {
    id: '$1',
    moduleId: '$1',
    isMod: true,
    useHash: false,
    useSameNameRequire: true,
    "release": "/public/c/$1",
    url: '${urlPrefix}/c/$1'
})
.match("/component_modules/(**).{styl,less,css,scss,sass}", {
    id: '$1.css',
    moduleId: '$1.css',
    isMod: true,
    useSprite: true,
    useHash: false,
    url: '${urlPrefix}/c/$1.css',
    release: '/public/c/$1.css'
})
.match("/component_modules/(**.tpl)", {
    isHtmlLike: true,
    release: '/views/c/$1'
})
.match("/component_modules/(**)", {
    "release": "/public/c/$1",
    url: '${urlPrefix}/c/$1'
})
.match("/components/(**).{styl,less,css,scss,sass}", Object.assign({}, {
    id: '${name}/${version}/$1.css',
    moduleId: '${name}/${version}/$1.css',
    isMod: true,
    useSprite: true,
    useHash: false,
    url: '${urlPrefix}/c/${name}/${version}/$1.css',
    release: '/public/c/${name}/${version}/$1.css'
}, theme && {
    id: THEME_PATH +'/${name}/${version}/$1.css',
    moduleId: THEME_PATH +'/${name}/${version}/$1.css',
    url: '${urlPrefix}/c/' + THEME_PATH + '/${name}/${version}/$1.css',
    release: '/public/c/' + THEME_PATH + '/${name}/${version}/$1.css'
}), true)
.match("/components/(**.js)", {
    id: '${name}/${version}/$1',
    moduleId: '${name}/${version}/$1',
    isMod: true,
    isComponent: true,
    useHash: false,
    useSameNameRequire: true,
    "release": '/public/c/${name}/${version}/$1',
    "url":'${urlPrefix}/c/${name}/${version}/$1'
})
.match("/components/(**.tpl)", {
    isHtmlLike: true,
    release: '/views/c/${name}/${version}/$1'
})
.match("/components/(**)", {
    "release": '/public/c/${name}/${version}/$1',
    "url":'${urlPrefix}/c/${name}/${version}/$1'
})
.match("/views/(**.tpl)", {
    useCache: false,
    isViews: true,
    isHtmlLike: true,
    release: '/views/${name}/${version}/$1'
})
.match("/views/(**.html)", {
    useCache: false,
    isViews: true,
    "release": '/public/${name}/${version}/$1',
    url: '${urlPrefix}/${name}/${version}/$1'
})
.match('/components', {
    release: false
})
.match('/component_modules', {
    release: false
})
.match('.DS_Store', {
    release: false
})

fis.hook('commonjs')

fis.match('*.html', {
    preprocessor: plugins.rand
})

if (fis.get('project.injection')) {
    fis.match('*.js', {
        preprocessor: plugins.inject
    })
}

const POST_PACKAGER = [plugins.framwork];

const isObject = require("../components/util").isObject;

// 插件相关设置
var pluginsConf = fis.get("project.plugins") || {};

// css 自动补完插件配置或开关
var customAutoPrefix = pluginsConf && pluginsConf.autoprefix || null;
// 默认自动补完配置
var autoPrefixConf = {
    "browsers": ["> 1%", "last 4 versions"]
    ,"cascade": true
    ,"flexboxfixer": false
};

if (customAutoPrefix) {
    if (isObject(customAutoPrefix)) {
        autoPrefixConf = Object.assign(autoPrefixConf, customAutoPrefix);
    }
}

switch (fis.get("project.mode")) {
    case "mobile":
        if (pluginsConf.enableAutoRouter !== false) {
            POST_PACKAGER.push(plugins.genRouter);
        }
        if (customAutoPrefix) {
            fis.media("prod").match('**.{css, less}',{
                postprocessor : fis.plugin("autoprefixer", autoPrefixConf)
            });
        }
        if (CDN_DOMAIN) {
            fis.match('image', {
                useDomain: true,
                domain: CDN_DOMAIN
            })
        }
        if (RES_USEHASH) {
            fis.match('image', {
                useHash: RES_USEHASH
            })
        }
    break;

    case "desktop":
        fis.media("prod").match('**.{css, less}',{
            postprocessor : fis.plugin("autoprefixer", autoPrefixConf)
        });
    break;
}

customAutoPrefix = null;
autoPrefixConf = null;

fis.match("::package", {
    postpackager: POST_PACKAGER
});