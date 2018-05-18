const fis = module.exports = require("fis3");
fis.require.prefixes = ["dirve", "scrat", "fis3", "fis"];
fis.cli.name = "dirve";
fis.cli.info = require("./package.json");
fis.cli.help.commands = [ "release", "install", "server", "init"];

Object.defineProperty(global, "dirve", {
    "enumerable" : true
    ,"writable" : false
    ,"value" : fis
});

fis.on("conf:loaded", function(){
    require("./config/default");
});
