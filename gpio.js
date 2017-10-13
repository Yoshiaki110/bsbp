const execSync = require('child_process').execSync;

exports.mode = function(gpio, mode) {
//mode = function(gpio, sw) {
  var cmd = 'gpio -g mode ' + gpio + ' ' + mode;
  execSync(cmd);
};

exports.write = function(gpio, sw) {
//write = function(gpio, sw) {
  var cmd = 'gpio -g write ' + gpio + ' ' + sw;
  execSync(cmd);
};

