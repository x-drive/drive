const plugins = {
    genRouter: require('../plugins/postpackager/gen-router')
}

fis.match("::package", {
    postpackager: plugins.genRouter
})
