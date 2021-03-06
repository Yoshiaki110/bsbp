//var BLEINT = 2000;var FILEINT = 60000;
var BLEINT = 2000;var FILEINT = 6000;

var common = require('./common.js');
common.LineMsg('bsbp ble開始しました');
console.log('bsbp ble開始しました');

var gpio = require('./gpio.js');
gpio.mode(8, 'out');
gpio.mode(9, 'out');
gpio.mode(10, 'out');
gpio.write(8, 0);   // red
gpio.write(9, 0);   // green
gpio.write(10, 0);  // orange


function restart() {
  gpio.write(8, 0);   // red
  gpio.write(9, 0);   // green
  gpio.write(10, 0);  // orange
  process.exit(1);
}


require('date-utils');
function datetimeStr() {
  var now = new Date();
  return now.toFormat('YYYYMMDDHH24MISS');
}
function dateStr() {
  var now = new Date();
  return now.toFormat('YYYYMMDD');
}
function timeStr() {
  var now = new Date();
  return now.toFormat('HH24MI');
}


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
var fdfifo = fs.openSync('fifo', "w");
function fifo(data) {
  try {
    fs.writeSync(fdfifo, data);
  } catch (e) {
    console.log(e);
  }
}

var CSV = '.csv';
var DATA_CSV = 'data.csv';
var DATA_DIR = '../bsbp_app/data/';
var RESULT_CSV = 'result.csv';
var RESULT_DIR = '../bsbp_app/data/';
//var E = "247189cfa806";
//var B = "247189cf7200";
var B = "247189cfa806";
var E = "247189cf7200";
var PERIOD = BLEINT; // ms

//global.mlogs = [];

global.connectedE = false;
global.connectedB = false;
global.obj_temp = {};
global.temp = {};
global.accel_x = {};
global.accel_y = {};
global.accel_z = {};
global.gyro_x = {};
global.gyro_y = {};
global.gyro_z = {};
global.hum = {};
global.baro = {};
global.lux = {};

function ti_simple_key(conned_obj) {
  conned_obj.notifySimpleKey(function() {
    console.info("ready: notifySimpleKey");
    console.info("/* left right (true = pushed, false = released) */");
    conned_obj.on("simpleKeyChange", function(left, right) { /* run per pushed button */
      console.log(left, right);
    });
  });
}
 
function ti_gyroscope(conned_obj) {
  conned_obj.enableGyroscope(function() {
    conned_obj.setGyroscopePeriod(2000, function() {
      conned_obj.notifyGyroscope(function() {
        //console.info("ready: notifyGyroscope");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('gyroscopeChange', function(x, y, z) {
          //console.log('gyro_x: ' + x, 'gyro_y: ' + y, 'gyro_z: ' + z);
          global.gyro_x[conned_obj.id] = x.toFixed(1);
          global.gyro_y[conned_obj.id] = y.toFixed(1);
          global.gyro_z[conned_obj.id] = z.toFixed(1);
        });
      });
    });
  });
}
 
function ti_ir_temperature(conned_obj) {
  conned_obj.enableIrTemperature(function() {
    conned_obj.setIrTemperaturePeriod(PERIOD, function() {
      conned_obj.notifyIrTemperature(function() {
        //console.info("ready: notifyIrTemperature");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
            //console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            //console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
          global.obj_temp[conned_obj.id] = objectTemperature.toFixed(1);
          global.temp[conned_obj.id] = ambientTemperature.toFixed(1);
          console.log('temperature = ', objectTemperature.toFixed(0), conned_obj.id, E );
          if (conned_obj.id == E) {
            //fifo(ambientTemperature.toFixed(0) + '\n');
            fifo(objectTemperature.toFixed(0) + '\n');
          }
        });
      });
    });
  });
}
 
function ti_accelerometer(conned_obj) {
  conned_obj.enableAccelerometer(function() {
    conned_obj.setAccelerometerPeriod(2000, function() {
      conned_obj.notifyAccelerometer(function() {
        //console.info("ready: notifyAccelerometer");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('accelerometerChange', function(x, y, z) {
            //console.log('\taccel_x = %d G', x.toFixed(1));
            //console.log('\taccel_y = %d G', y.toFixed(1));
            //console.log('\taccel_z = %d G', z.toFixed(1));
          global.accel_x[conned_obj.id] = x.toFixed(1);
          global.accel_y[conned_obj.id] = y.toFixed(1);
          global.accel_z[conned_obj.id] = z.toFixed(1);
        });
      });
    });
  });
}
 
function ti_humidity(conned_obj) {
  conned_obj.enableHumidity(function() {
    conned_obj.setHumidityPeriod(/*PERIOD*/2000, function() {
      conned_obj.notifyHumidity(function() {
        //console.info("ready: notifyHumidity");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('humidityChange', function(temperature, humidity) {
            //console.log('\ttemperature = %d °C', temperature.toFixed(1));
            //console.log('\thumidity = %d %', humidity.toFixed(1));
            //console.log(conned_obj.id, temperature.toFixed(1), humidity.toFixed(1));
//          global.temp[conned_obj.id] = temperature.toFixed(1); たぶんこれが-40℃になる？
//          if (humidity.toFixed(1) == 100) {
//            console.error('humidity is 100% : ' + humidity.toFixed(1));
//            restart();
//          }
          global.hum[conned_obj.id] = humidity.toFixed(1);
        });
      });
    });
  });
}
 
function ti_magnetometer(conned_obj) {
  conned_obj.enableMagnetometer(function() {
    conned_obj.setMagnetometerPeriod(2000, function() {
      conned_obj.notifyMagnetometer(function() {
        //console.info("ready: notifyMagnetometer");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('magnetometerChange', function(x, y, z) {
            //console.log('\tmagnet_x = %d μT', x.toFixed(1));
            //console.log('\tmagnet_y = %d μT', y.toFixed(1));
            //console.log('\tmagnet_z = %d μT', z.toFixed(1));
        });
      });
    });
  });
}
 
function ti_barometric_pressure(conned_obj) {
  conned_obj.enableBarometricPressure(function() {
    conned_obj.setBarometricPressurePeriod(PERIOD, function() {
      conned_obj.notifyBarometricPressure(function() {
        //console.info("ready: notifyBarometricPressure");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('barometricPressureChange', function(pressure) {
            //console.log('\tpressure = %d mBar', pressure.toFixed(1));
          global.baro[conned_obj.id] = pressure.toFixed(1);
        });
      });
    });
  });
}
 
function ti_luxometer(conned_obj) {
  conned_obj.enableLuxometer(function() {
    conned_obj.setLuxometerPeriod(PERIOD, function() {
      conned_obj.notifyLuxometer(function() {
        //console.info("ready: notifyLuxometer");
        //console.info("notify period = " + PERIOD + "ms");
        conned_obj.on('luxometerChange', function(lux) {
          //console.log('\tlux = %d', lux.toFixed(1));
          global.lux[conned_obj.id] = lux.toFixed(1);
        });
      });
    });
  });
}
 
var SensorTag = require('sensortag');
//var SensorTag = require('./index');
var aggregate = require('./aggregate.js');
var execSync = require('child_process').execSync;

function discoverB() {
  SensorTag.discoverByUuid(B, function(sensorTag) {
    console.info('found(B):' + sensorTag.id);
    sensorTag.connectAndSetup(function() {
      sensorTag.readBatteryLevel(function(error, batteryLevel) {
        console.info('connect(B):' + sensorTag.id + ' batt:' +  batteryLevel + '%');
        global.connectedB = true;
        gpio.write(8, 1);   // red
        ti_gyroscope(sensorTag);
        ti_ir_temperature(sensorTag);
        ti_accelerometer(sensorTag);
        ti_humidity(sensorTag);
        //ti_barometric_pressure(sensorTag);
        //ti_luxometer(sensorTag);
      });
    });
    sensorTag.on("disconnect", function() {
      console.info("disconnect(B) and exit");
      try {
        execSync('pkill mpg321');
      } catch (e) {
        //console.log(e);
      }
      rename();
      restart();
    });
  });
}
function discoverE() {
  SensorTag.discoverByUuid(E, function(sensorTag) {
    console.info('found(E):' + sensorTag.id);
    sensorTag.connectAndSetup(function() {
      discoverB();
      sensorTag.readBatteryLevel(function(error, batteryLevel) {
        console.info('connect(E):' + sensorTag.id + ' batt:' +  batteryLevel + '%');
        global.connectedE = true;
        gpio.write(9, 1);   // green
        //ti_gyroscope(sensorTag);
        ti_ir_temperature(sensorTag);
        //ti_accelerometer(sensorTag);
        ti_humidity(sensorTag);
        ti_barometric_pressure(sensorTag);
        ti_luxometer(sensorTag);
      });
    });
    sensorTag.on("disconnect", function() {
      console.info("disconnect(E) and exit");
      try {
        execSync('pkill mpg321');
      } catch (e) {
        //console.log(e);
      }
      rename();
      restart();
    });
  });
}

function rename() {
  console.log("renane");
  for (var i = 1; i < 100; i++) {
    var fname = dateStr() + (('00' + i).slice(-2));
    try {
      fs.statSync(DATA_DIR + fname + CSV);
      console.log("file exist :" + DATA_DIR + fname + CSV);
    } catch(err) {    // ファイルがなかったらヘッダーを書く
      console.log("renane " + DATA_DIR + DATA_CSV + ' ' + DATA_DIR + fname + CSV);
      aggregate.aggregate(DATA_DIR + DATA_CSV, RESULT_DIR + RESULT_CSV, fname);
      fs.renameSync(DATA_DIR + DATA_CSV, DATA_DIR + fname + CSV);
      break;
    }
  }
}


var SEP = '\t';
function loop() {
  console.log("loop " + global.connectedE);
  if (global.connectedE) {
    // ヘッダー
    try {
      fs.statSync(DATA_DIR + DATA_CSV);
    } catch(err) {    // ファイルがなかったらヘッダーを書く
      write(DATA_DIR + DATA_CSV, 'time' + SEP + 'body_temperature' + SEP + 'body_ambient_temperature' + SEP + 'body_humidity' + SEP + 'body_gyrodcope_x' + SEP + 'body_gyrodcope_y' + SEP + 'body_gyrodcope_z' + SEP + 'body_accelerometer_x' + SEP + 'body_accelerometer_y' + SEP + 'body_accelerometer_z' + SEP + 'temperature' + SEP + 'humidity' + SEP + 'barometer' + SEP + 'illuminometer\n');
    }
    var log = timeStr() + SEP + global.obj_temp[B] + SEP + global.temp[B] + SEP + global.hum[B] + SEP + global.accel_x[B] + SEP + global.accel_y[B] + SEP + global.accel_z[B] + SEP + global.gyro_x[B] + SEP + global.gyro_y[B] + SEP + global.gyro_z[B] + SEP + global.temp[E] + SEP + global.hum[E] + SEP + global.baro[E] + SEP + global.lux[E];
    write(DATA_DIR + DATA_CSV, log + '\n');
    console.log(log);
  }
  setTimeout(loop, FILEINT);
}

discoverE();
setTimeout(loop, 5000);

/*
var fs = require("fs");

require('date-utils');
function datetimeStr() {
  var now = new Date();
  return now.toFormat('YYYYMMDDHH24MISS');
}
function dateStr() {
  var now = new Date();
  return now.toFormat('YYYYMMDD');
}
function timeStr() {
  var now = new Date();
  return now.toFormat('HH24MISS');
}

global.mlogs = [];
global.fireTime = new Date();


function loop() {
  console.log("loop");
  try {
    fs.statSync('executing');
    setTimeout(loop, 1000);
  } catch(err) {
    console.log("end");
    for (var i = 0; i < global.mlogs.length; i++) {
      console.log(global.mlogs[i]);
    }
  }
  var dt = new Date() - global.fireTime;
  if (dt > 10000) {
    var time = timeStr();
    global.mlogs.push(time);
    console.log(global.mlogs);
    global.fireTime = new Date();
  }
}


function prepare() {
  console.log("prepare");
  try {
    fs.statSync('executing');
    loop();
  } catch(err) {
    setTimeout(prepare, 1000);
  }
}

prepare();
*/
