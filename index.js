const fis = module.exports = require("fis3");
fis.require.prefixes = ["drive", "scrat", "fis3", "fis"];
fis.cli.name = "drive";
fis.cli.info = require("./package.json");
fis.cli.help.commands = [ "release", "install", "server", "init"];

require("./config/default")(fis);
