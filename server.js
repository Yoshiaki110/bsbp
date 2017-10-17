var fs = require("fs");
function write(fname, data) {
  try {
    var fd = fs.openSync(fname, "a");
    fs.writeSync(fd, data);
    fs.closeSync(fd);
  } catch (e) {
    console.log(e);
  }
}
function read(fname) {
  try {
    return fs.readFileSync(fname);
  } catch (e) {
    console.log(e);
  }
}


var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static('public'));

app.get('/api/setting', function(req, res) {
  var d = JSON.parse(fs.readFileSync('setting.json', 'utf8'));
  console.log('get setting', d);
  res.json(d);
});
app.post('/api/setting', function(req, res) {
  console.log('post setting', req.body);
  var str = JSON.stringify(req.body, null, '  ');
  //console.log('str', str);
  fs.writeFileSync('setting.json', str);
  res.json(req.body);
});

app.get('/api/realtime', function(req, res) {
  var d = [];
  for (key in global.lux) {
    var e = {
      id: key,
      obj_temp: global.obj_temp[key],
      temp: global.temp[key],
      accel_x: global.accel_x[key],
      accel_y: global.accel_y[key],
      accel_z: global.accel_z[key],
      hum: global.hum[key],
      baro: global.baro[key],
      lux: global.lux[key]
    }
    d.push(e);
  }

//  var d = JSON.parse(fs.readFileSync('setting.json', 'utf8'));
  console.log('get realtime', d);
  res.json(d);
});

global.logging = false;
app.post('/api/start', function(req, res) {
  console.log('post start', req.body);
  write('executing', 'executing')
  res.json(req.body);
});
app.post('/api/stop', function(req, res) {
  console.log('post stop', req.body);
  fs.unlinkSync('executing');
  res.json(req.body);
});
app.listen(80);
