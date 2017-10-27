var EL=require('echonet-lite');
function echonet_init() {
  var objList=['05ff01'];
  var elsocket=EL.initialize(objList,function(rinfo,els){
    //console.dir(rinfo);
    //console.dir(els);
  });
}

//var IP = '192.168.10.191';
var IP = '192.168.10.239';
//EL.search();
function aircon_on() {
  EL.sendOPC1(IP,[0x05,0xff,0x01],[0x01,0x30,0x01],EL.SETI,0x80,[0x30]);
}
function aircon_off() {
  EL.sendOPC1(IP,[0x05,0xff,0x01],[0x01,0x30,0x01],EL.SETI,0x80,[0x31]);
}
function aircon_temp(temp) {
  EL.sendOPC1(IP,[0x05,0xff,0x01],[0x01,0x30,0x01],EL.SETI,0xb3,[temp]);
}
function aircon_heater() {
  EL.sendOPC1(IP,[0x05,0xff,0x01],[0x01,0x30,0x01],EL.SETI,0xb0,[0x43]);
}
function aircon_cooler() {
  EL.sendOPC1(IP,[0x05,0xff,0x01],[0x01,0x30,0x01],EL.SETI,0xb0,[0x42]);
}


var fs = require("fs");
/*
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
*/

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/ura/', express.static('public'));
app.use('/', express.static('../bsbp_app'));

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

app.post('/api/changerow', function(req, res) {
  console.log('post changerow', req.body);
  var file = '../bsbp_app/' + req.body.file;
  var dat = '';
  var lines = fs.readFileSync(file).toString().split('\n');
  for (var i = 0; i < lines.length; i++) {
    console.log((i+1) + ':' + lines[i]);
    if ((i+1) == req.body.line) {
      dat = dat + req.body.data + '\n';
    } else if ((i+1) == lines.length && lines[i] == '') {
      ; // last line and no data then not output
    } else {
      dat = dat + lines[i] + '\n';
    }
  }
  fs.writeFile(file, dat);
  res.json(req.body);
});

global.alarm = '';
global.alarmfile = '';
global.temp_set = 0;
global.temp_real = 0;
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
//global.logging = false;
app.post('/api/start', function(req, res) {
  console.log('post start', req.body);
  global.alarm = req.body.time;
  global.alarmfile = req.body.file;
  global.temp_set = req.body.temp;
  res.json(req.body);
});
app.post('/api/stop', function(req, res) {
  console.log('post stop', req.body);
  execSync('pkill mpg321');
  global.alarm = '';
  res.json(req.body);
});


var common = require('./common.js');

global.alarming = false;


function loop() {
  var time = common.timeStr();
  console.log('loop', time, global.alarm, global.temp_real, global.temp_set);
  aircon_temp(global.temp_real);
  if (global.temp_real != 0 && global.temp_set != 0) {
    if (global.temp_real > global.temp_set) {
      console.log('cooler');
      aircon_on();
      aircon_cooler();
    } else if (global.temp_real < global.temp_set) {
      console.log('heater');
      aircon_on();
      aircon_heater();
    } else {
      aircon_off();
    }
  }
  if (time == global.alarm) {
    if (!global.alarming) {
      var cmd = 'mpg321 ../bsbp_app/' + global.alarmfile + ' -l0 -g 1000';
      exec(cmd);
      global.alarming = true;
    }
  } else {
    global.alarming = false;
  }
  setTimeout(loop, 5000); 
}

function prepare() {
  if (common.IpAddress().length == 0) {
    setTimeout(prepare, 1000);
  } else {
    common.LineMsg('bsbp server start');
    app.listen(80);
    echonet_init();
    loop();
  }
}

prepare();

var readline = require('readline');

function temp() {
  var rs = fs.createReadStream('fifo');
  var rl = readline.createInterface(rs, {});
  rl.on('line', function(line) {
    global.temp_real = parseInt(line)
    console.log('ondo', line, global.temp_real);
  });
  rl.on('close', function() {
    console.log('close');
    temp();
  });
}
temp();

