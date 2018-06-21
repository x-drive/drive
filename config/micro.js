
const PLUGINS = {
    "handlMicroAppJson": require("../plugins/preprocessor/handl-micro-app-json")
    ,"handlMicroAppJs": require("../plugins/preprocessor/handl-micro-app-js")
}

/**
 * 资源文件存储对应的环境文件夹名称
 * @type {Object}
 */
const RELEASE_DIR = {
    "0": "develop"
    ,"1": "sandbox"
    ,"2": "product"
}

/**
 * 环境类型映射
 * @type {Object}
 */
const ENV_MAP = {
    "0":"dev"
    ,"1":"sandbox"
    ,"2":"prod"
}

// 声明的环境
var env = fis.get("project.env");
// 对应的环境名称
var envType;

var releaseDir;
if (env) {
    releaseDir = RELEASE_DIR[env];
    envType = ENV_MAP[env];
} else {
    releaseDir = "develop";
    envType = "dev";
}

// 写入环境名称
fis.set("project.envtype", envType);

// cdn 域名
var imageDomain = fis.get("project.image-domain");

// cdn 上存储的目录
var imageReleaseDir = fis.get("project.image-release-dir");
if (imageReleaseDir) {
    // 处理环境文件夹
    imageReleaseDir = imageReleaseDir.replace(/^\//, "").replace("{envdir}", releaseDir);
    if (!/\/$/.test(imageReleaseDir)) {
        imageReleaseDir = imageReleaseDir + "/";
    }
} else {
    imageReleaseDir = "";
}

if (imageDomain) {
    fis.set("project.domain", `${imageDomain}/${imageReleaseDir}`);
}

fis.set("project.fileType.text", "wxml,wxss");

fis.media("prod")
    .match("*.{css, less, wxss}", {
        "optimizer": fis.plugin("clean-css")
    })
    .match("*.png", {
        "optimizer": fis.plugin("png-compressor", {
            type: 'pngquant'
        })
    });

fis.match("*.less",{
    "parser": fis.plugin("less")
    ,"rExt": ".wxss"
});
fis.match("*.tpl", {
        "rExt": ".wxml"
    })
    .match("/(**)", {
        "release": "/project/$1"
    })
    .match("/(app.{less, wxss})", {
        "useDomain": true
        ,"isCssLike": true
        ,"useCompile": true
        ,"useCache": false
        ,"useHash": false
        ,"useMap": false
        ,"release" : "/project/$1"
    })
    .match("/component_modules/(**.{less,css,wxss})", {
        "useDomain": true
        ,"isCssLike": true
        ,"useCompile": true
        ,"useCache": false
        ,"useHash": false
        ,"useMap": false
        ,"release" : "/project/component_modules/$1"
    })
    .match("/components/(**.{less, css, wxss})", {
        "useDomain": true
        ,"isCssLike": true
        ,"useCompile": true
        ,"useCache": false
        ,"useHash": false
        ,"useMap": false
        ,"release" : "/project/components/$1"
    })
    .match("/pages/(**.{less, css, wxss})", {
        "isCssLike": true
        ,"release" : "/project/pages/$1"
        ,"useCompile": true
        ,"useDomain": true
        ,"isJsLike": false
        ,"useCache": false
        ,"useMap": false
        ,"useHash": false
    })
    .match('.DS_Store', {
        "release": false
    })
    .match("/components", {
        "release": false
    })
    .match("/component_modules", {
        "release": false
    })
    .match("/pages", {
        "release": false
    })
    .match("/@scripts/**", {
        "release": false
    })
    .match("/**.md", {
        "release": false
    });

fis.match("/pages/(**.{png, jpg})", {
    "release": `/public/${imageReleaseDir}$1`
    ,"url" : '/$1'
})
.match("/components/(**.{png, jpg})", {
    "release": `/public/${imageReleaseDir}c/$1`
    ,"url" : '/c/$1'
})

fis.match("*.js", {
    "preprocessor": PLUGINS.handlMicroAppJs
});

PLUGINS.handlMicroAppJson.init();
fis.match("/**.json", {
    "preprocessor": PLUGINS.handlMicroAppJson
});
