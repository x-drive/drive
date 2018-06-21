'use strict';

const fis = module.exports = require("fis3");
fis.require.prefixes = ["dirve", "scrat", "fis3", "fis"];
fis.cli.name = "dirve";
fis.cli.info = require("./package.json");
fis.cli.help.commands = [ "release", "install", "server", "init"];
fis.cli.version = require("./version");

Object.defineProperty(global, "dirve", {
    "enumerable" : true
    ,"writable" : false
    ,"value" : fis
});

/**
BUG
当 components 目录下有模块 A
同时 components 目录当另外其他模块 B 下又有同名模块 A
此时在 B 中以 require("./A") 的时候 fis 在查询 B 的依赖时会把上层的 A 模块当成本目录下的 A
该问题只出现在以 ./ 同时不带模块文件后缀声明依赖时出现

FIXME
在 fis 进行文件查找时，手动处理一下以上描述的场景，将模块路径提前替换成完整的路径以解决该问题
 */
const CURRENT_DIR_REGEXP = /^\.\/(.*)/;
const DIR_S = /\//;
fis.on("lookup:file", function(info, file){
    var p = info.rest.match(CURRENT_DIR_REGEXP);
    var dirS;
    if (
        file &&
        p && p[1] &&
        (dirS = p[1].match(DIR_S)) === null
    ) {
        info.rest = `${file.subdirname}/${p[1]}`;
    }
});

fis.on("conf:loaded", function(){
    require(`./config/${fis.get("project.mode") === "micro" ? "micro" : "default"}`);
});

// release 的时候是否已经显示过版本信息
var showed = false;
fis.on("release:start", function(){
    if (!showed) {
        fis.cli.version();
        showed = true;
    }
});
