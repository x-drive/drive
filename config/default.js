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

var version = fis.config.get("version");
var name = fis.config.get("name");
var urlPrefix = fis.config.get("urlPrefix");

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
    .match("/component_modules/{(*).js,**/(*).js}", {
        "isMod": true
        ,"moduleId": "$1"
    })
    .match("/component_modules/(**)", {
        "release": "/public/c/$1"
        ,"url": `${urlPrefix}/c/${name}/${version}/$1`
    })
    .match("/components/(**)", {
        "release": `/public/c/${name}/${version}/$1`
        ,"url": `${urlPrefix}/c/${name}/${version}/$1`
    })
    .match("/views/(**)", {
        "release": `/public/${name}/${version}/$1`
    })
    .match("README.md", {
        "release": false
    });

fis.config.set("settings.optimizer.uglify-js", {
    "mangle": {
        "except": "exports, module, require, define"
    }
});

fis.hook("commonjs");
