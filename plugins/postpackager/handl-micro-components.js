const path = require("path");

// 页面判断正则
const PAGE_TEST_REG_EXP = /^\/pages\/[\w\/\.-]+\.js$/;

// 获取所有 component 声明正则
const ALL_COMPONENT_REG_EXP = /@component\(['"](.*)['"]\)[;]?/g;

// 获取 component 声明正则
const COMPONENT_REG_EXP = /@component\(['"](.*)['"]\)/;

/**
 * 驼峰转连字符
 * @param  {String} str 原始字符串
 * @return {String}     转化后的字符串
 */
function camelize2line(str) {
    return str.replace(/[A-Z]/g, function(str){
        return `-${str.toLowerCase()}`;
    });
}

module.exports = function (ret, conf, settings, opt) {
    var pages = Object.keys(ret.src).filter(function(name){
        return PAGE_TEST_REG_EXP.test(name);
    });
    var dirs = {};

    if (pages && pages.length) {
        let dist = opt.dest;
        dist = dist.replace(/[\.]+/, "");
        if (dist.charAt(0) !== "/") {
            dist = "/" + dist;
        }
        while(pages.length) {
            let page = pages.pop();
            let file = ret.src[page];
            if (!dirs[file.subdirname]) {
                dirs[file.subdirname] = file.dirname.replace(
                    file.subdirname
                    ,`${dist}${file.release.replace("/"+file.basename, "")}`
                );
            }

            let content = file.getContent();
            let components = content.match(ALL_COMPONENT_REG_EXP);

            if (components && components.length) {
                let pageJsonPath = `${dirs[file.subdirname]}/${file.filename}.json`;
                let hasJson = fis.util.isFile(pageJsonPath);

                let pageJson;
                if (hasJson) {
                    pageJson = fis.util.readJSON(pageJsonPath);
                } else {
                    pageJson = {};
                }
                pageJson.usingComponents = pageJson.usingComponents || {};

                while(components.length) {
                    let comStr = components.pop();
                    let com = comStr.match(COMPONENT_REG_EXP);
                    com = com && com[1] || null;
                    if (com) {
                        pageJson.usingComponents[camelize2line(com)] = `/components/${com}/${com}`;
                    }
                    content = content.replace(comStr, "");
                }
                file.setContent(content);
                fis.util.write(pageJsonPath, JSON.stringify(pageJson, 4, 4));
            }
        }
    }
}
