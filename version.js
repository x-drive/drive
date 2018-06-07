
const LOGO = [
    ``
    ,` ______  _____  ______ _    _ _______ `.cyan
    ,` |     \\   |   |_____/  \\  /  |______ `.cyan
    ,` |_____/ __|__ |    \\_   \\/   |______ `.cyan + ` v${fis.cli.info.version}`.grey
    ,``
];
module.exports = function(){
    console.log(LOGO.join("\n"));
}
