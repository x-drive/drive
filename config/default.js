const plugins = {
    framwork: require('../plugins/postpackager/framework-conf'),
    rand: require('../plugins/preprocessor/rand'),
    genRouter: require('../plugins/postpackager/gen-router')
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

fis.match("*.less", {
    "parser": fis.plugin("less")
    ,"rExt": ".css"
})

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
    "release": "/public/c/$1"
    ,url: '${urlPrefix}/c/$1'
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
    "release": "/public/c/$1"
    ,url: '${urlPrefix}/c/$1',
})
.match("/components/(**).{styl,less,css,scss,sass}", {
    id: '${name}/${version}/$1.css',
    moduleId: '${name}/${version}/$1.css',
    isMod: true,
    useSprite: true,
    useHash: false,
    url: '${urlPrefix}/c/${name}/${version}/$1.css',
    release: '/public/c/${name}/${version}/$1.css'
})
.match("/components/(**.js)", {
    id: '${name}/${version}/$1',
    moduleId: '${name}/${version}/$1',
    isMod: true,
    isComponent: true,
    useHash: false,
    useSameNameRequire: true,
    "release": '/public/c/${name}/${version}/$1'
    ,"url":'${urlPrefix}/c/${name}/${version}/$1'
})
.match("/components/(**.tpl)", {
    isHtmlLike: true,
    release: '/views/c/${name}/${version}/$1'
})
.match("/components/(**)", {
    "release": '/public/c/${name}/${version}/$1'
    ,"url":'${urlPrefix}/c/${name}/${version}/$1'
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
.match("/views/(**)", {
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

fis.hook('commonjs')

fis.match('*.html', {
    preprocessor: plugins.rand
})

const POST_PACKAGER = [plugins.framwork];
switch (fis.get("project.mode")) {
    case "mobile":
        POST_PACKAGER.push(plugins.genRouter)
    break;
}

fis.match("::package", {
    postpackager: POST_PACKAGER
})
