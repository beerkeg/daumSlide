var cp = require("child_process");

var isWin = !!process.platform.match(/^win/);
var command = "grunt"+(isWin?".cmd":"");

var grunt = cp.spawn(command, ["remote", "-v"], {cwd:"node_modules/.bin", stdio: 'inherit'});

grunt.on('exit', function (code) {
    console.info('build process exited with code ' + code);
});
