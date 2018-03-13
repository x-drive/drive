module.exports = fis => {
    fis.match("*.less", {
        "parser": fis.plugin("less")
        ,"rExt": ".css"
    });

    fis.match("/{components,component_modules}/**.js", {
        "optimizer": fis.plugin("uglify-js")
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
    });

    fis.match("*.{css,less}", {
        "optimizer": fis.plugin("clean-css")
    });

    fis.match("*.png", {
        "optimizer": fis.plugin("png-compressor")
    });

    fis.match("/@server/(**)", {
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
    });

    fis.config.set("settings.optimizer.uglify-js", {
        "mangle": {
            "except": "exports, module, require, define"
        }
    });

    // fis.hook("module", {
    //     "mode": "commonJs"
    // });
}
