const fs = require("fs");
const path = require("path");

/**
 * 包含的 pages
 * @type {Array}
 */
const pages = [];

/**
 * 排除的文件或文件夹判断正则
 * @type {Array}
 */
var excludeRegexp = [
    /^@/
    ,/^src$/
    ,/^\./
    ,/^_/
]

/**
 * 检查是否是要排除的
 * @param  {String}  name 待检测的名称
 * @return {Boolean}      判断结果
 */
function checkExclude(name) {
    for (let i = 0; i < excludeRegexp.length; i++) {
        if (excludeRegexp[i].test(name)) {
            return true;
        }
    }
    return false;
}

/**
 * 递归处理文件夹
 * @param  {String}    path              文件目录
 * @param  {Int}       floor             层级
 * @param  {Function}  callback          查找到文件时的处理函数
 * @return {Undefined}                   无返回值
 */
function walk(path, callback) {
    var files = fs.readdirSync(path);
    files.forEach(function(item) {
        if (!checkExclude(item)) {
            var tmpPath = path + "/" + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                walk(tmpPath, callback);
            } else if (!stats.isDirectory()){
                callback(tmpPath, item);
            }
        }
    });
}

var modPages = {}

/**
 * 是否是 JS 文件判断
 * @type {RegExp}
 */
var isJs = /\.js$/;

var modNameRegExp = /pages\/(.*\/){1}/;

var inited = false;

function init() {
    // 生成包含的 page
    walk(
        path.resolve(fis.project.getProjectPath('/') + "/pages")
        ,(path, fileName) => {
            if (isJs.test(path)) {
                let fileInDir = path.split("pages")[1];
                let alias = fileInDir.replace("/"+fileName, "");
                let filePath = ("pages" + fileInDir).replace(isJs, "");

                fileName = fileName.replace(isJs, "");
                let mod = alias.substr(1).replace("/"+fileName, "");

                if (mod) {
                    modPages[mod] = modPages[mod] || {"items":[], "hide": true};
                    modPages[mod].items.push({
                        "url": "/"+filePath
                        ,"type": "redirect"
                        ,"name": alias
                    });
                }
                if (fileInDir.indexOf("loading/loading") !== -1) {
                    // 保证 loading 一定是数组的第一个
                    pages.unshift(filePath);
                } else {
                    pages.push(filePath);
                }
            }
        }
    );
    inited = true;
}

/**
 * 处理 app.json
 * @param  {String} content 文件内容
 * @param  {Object} file    文件信息对象
 * @param  {Object} conf    处理规则配置对象
 * @return {String}         处理后的文件内容
 */
function handlAppJson(content, file, conf) {
    if (file.subpath.indexOf("app.json") !== -1) {
        // 把 pages 写到 app.json 中
        let body = JSON.parse(content);
        body.pages = pages;
        content = JSON.stringify(body, 4, 4);
    }
    return content;
}

module.exports = handlAppJson;
module.exports.init = function() {
    if (!inited) {
        init();
        fis.emit("plugin:appjson:inited", modPages);
        modPages = null;
    }
}
