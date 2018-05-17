const RAND_RE = /\"[^\"]*__rand\"/g;        
module.exports = function rand(content, file, conf) {
    if (file.subpath.indexOf("/views/") > -1) {
        while (r = RAND_RE.exec(content)) {
            var str = r[0],
                rep = str;
            rep = rep.replace("__rand", Date.now().toString(32));
            content = content.replace(str, rep);
        }
    }
    return content;
}