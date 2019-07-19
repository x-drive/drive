module.exports = function rand(content, file, conf) {
    const injection = fis.get('project.injection')
    for (let key of Object.keys(injection)) {
        content = content.replace(new RegExp(key, 'g'), JSON.stringify(injection[key]))
    }
    return content;
}