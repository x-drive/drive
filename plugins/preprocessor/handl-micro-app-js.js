
var modPages = {};
/**
 * 简单获取设置对象的正则
 * @type {RegExp}
 */
const JSON_BODY_REGEXP = /\{.*\}[\n\r\t]?$/;

fis.on("plugin:appjson:inited", function(data){
    if (data) {
        modPages = data;
    }
});

/**
 * 处理 entId 与页面
 * @param  {String} content 文件内容
 * @param  {Object} file    文件信息对象
 * @param  {Object} conf    处理规则配置对象
 * @return {String}         处理后的文件内容
 */
function handler(content, file, conf) {
    if (file.subpath.indexOf("@conf/ent") > -1) {
        var envtype = fis.get("project.envtype");
        let body = content.match(JSON_BODY_REGEXP);
        if (body && body[0]) {
            body = JSON.parse(body[0]);
        } else {
            body = {};
        }
        body.entCode = fis.get("project.entid");
        
        if( fis.get("project.apis") !== undefined){
            body.apis = fis.get("project.apis");
        }
        if (!body.type || body.type !== envtype) {
            body.type = envtype;
        }
        body.buildTime = new Date().toLocaleString()
        body.appVersion = fis.get("version")
        content = content.replace(
            JSON_BODY_REGEXP
            ,JSON.stringify(body, 4, 4)
        );
        body = null;
    }
    if (file.subpath.indexOf("app.js") > -1) {
        content = content.replace("{}", JSON.stringify(modPages, 4, 4));
    }
    return content;
}

module.exports = handler;
