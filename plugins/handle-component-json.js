const fs = require("fs");
const path = require("path");

var inited = false;

var components = null;

/**
 * 处理项目中的 component.json 配置
 */
function handleComponentJson() {
    var projectPath = fis.project.getProjectPath("/");
    var componentJson;
    var componentJsonFile = path.resolve(projectPath + "/component.json")
    if (fis.util.isFile(componentJsonFile)) {
        componentJson = fis.util.readJSON(componentJsonFile);
    } else {
        return false;
    }

    var access = false;
    try {
        fs.accessSync(
            path.resolve(projectPath + "/component_modules")
            ,fs.constants.F_OK
        );
        access = true;
    } catch(err) {
        fis.log.warn("component_modules 文件夹不存在");
    }
    if (access) {
        if (componentJson && componentJson.dependencies) {
            components = componentJson.dependencies;
        }
        componentJson = null;
    }
    return true;
}


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

/**
 * JS 文件后缀
 * @type {[type]}
 */
const IS_JS_REG = /\.js$/i;

/**
 * 设置不 release 的公共组件
 */
function setIgnoreComponents(){
    var ignoreComs = [];
    var projectPath = fis.project.getProjectPath("/");
    var projectComs = {};
    var projectIgnore = fis.get("project.ignore") || [];

    // 生成已声明使用的组件查找对象
    Object.keys(components).forEach(modName => {
        projectComs[`/component_modules/${modName}/${components[modName]}/`] = true;
    });

    // 递归整个 component_modules 目录，生成需要排除的模块设置语句
    walk(
        path.resolve(projectPath + "/component_modules")
        ,(filePath, fileName) => {
            if (IS_JS_REG.test(fileName)) {
                // 每个模块以 js 为主要判断依据
                let modPath = filePath.replace(projectPath, "")
                                        .replace(fileName, "");
                if (!projectComs[modPath] && ignoreComs.indexOf(modPath) === -1) {
                    ignoreComs.push(
                        `${modPath}**`
                    );
                }
            }
        }
    );
    projectIgnore = projectIgnore.concat(ignoreComs);
    fis.set("project.ignore", projectIgnore);

    projectIgnore = null;
    projectComs = null;
    ignoreComs = null;
}

module.exports = function() {
    if (!inited && handleComponentJson()) {
        fis.emit("plugin:componentjson:inited", components);
        setIgnoreComponents();
        components = null;
        inited = true;
    }
}
