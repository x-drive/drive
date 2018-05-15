const plugins = {
    define: require('../plugins/postprocessor/define'),
    framwork: require('../plugins/postpackager/framework-conf')
}

fis.match("*.less", {
    "parser": fis.plugin("less")
    ,"rExt": ".css"
});

fis.media("prod")
    .match("/{components,component_modules}/**.js", {
        "optimizer": fis.plugin("uglify-js")
    })
    .match("*.{css,less}", {
        "optimizer": fis.plugin("clean-css")
    })
    .match("*.png", {
        "optimizer": fis.plugin("png-compressor")
    });

    fis.config.set("settings.optimizer.uglify-js", {
        "mangle": {
            "except": "exports, module, require, define"
        }
    });

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
        moduleId : '$1',
        isMod : true,
        useHash : false,
        "release": "/public/c/$1"
        ,url : '${urlPrefix}/c/$1',
    })
    .match("/component_modules/(**)", {
        "release": "/public/c/$1"  
        ,url : '${urlPrefix}/c/$1',
    })
    .match("/components/(**.js)", {
        id : '${name}/${version}/$1',
        moduleId : '${name}/${version}/$1',
        isMod : true,
        isComponent : true,
        useHash : false,
        "release": '/public/c/${name}/${version}/$1'
        ,"url":'${urlPrefix}/c/${name}/${version}/$1',
    })
    .match("/components/(**)", {  
        "release": '/public/c/${name}/${version}/$1'
        ,"url":'${urlPrefix}/c/${name}/${version}/$1',
    })
    .match("/views/(**)", {
        isViews : true,
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

fis.match("::package", {
    postpackager: plugins.framwork  
})
