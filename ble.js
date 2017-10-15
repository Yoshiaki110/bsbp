var gpio = require('./gpio.js');
gpio.mode(8, 'out');
gpio.mode(9, 'out');
gpio.mode(10, 'out');
gpio.write(8, 0);   // red
gpio.write(9, 0);   // green
gpio.write(10, 0);  // orange

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


var E = "247189cfa806";
var B = "247189cf7200";
var period = 2000; // ms

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
    conned_obj.setGyroscopePeriod(/*period*/500, function() {
      conned_obj.notifyGyroscope(function() {
        //console.info("ready: notifyGyroscope");
        //console.info("notify period = " + period + "ms");
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
    conned_obj.setIrTemperaturePeriod(period, function() {
      conned_obj.notifyIrTemperature(function() {
        //console.info("ready: notifyIrTemperature");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
            //console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            //console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
          global.obj_temp[conned_obj.id] = objectTemperature.toFixed(1);
          global.temp[conned_obj.id] = ambientTemperature.toFixed(1);
        });
      });
    });
  });
}
 
function ti_accelerometer(conned_obj) {
  conned_obj.enableAccelerometer(function() {
    conned_obj.setAccelerometerPeriod(/*period*/500, function() {
      conned_obj.notifyAccelerometer(function() {
        //console.info("ready: notifyAccelerometer");
        //console.info("notify period = " + period + "ms");
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
    conned_obj.setHumidityPeriod(period, function() {
      conned_obj.notifyHumidity(function() {
        //console.info("ready: notifyHumidity");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('humidityChange', function(temperature, humidity) {
            //console.log('\ttemperature = %d °C', temperature.toFixed(1));
            //console.log('\thumidity = %d %', humidity.toFixed(1));
          global.temp[conned_obj.id] = temperature.toFixed(1);
          global.hum[conned_obj.id] = humidity.toFixed(1);
        });
      });
    });
  });
}
 
function ti_magnetometer(conned_obj) {
  conned_obj.enableMagnetometer(function() {
    conned_obj.setMagnetometerPeriod(period, function() {
      conned_obj.notifyMagnetometer(function() {
        //console.info("ready: notifyMagnetometer");
        //console.info("notify period = " + period + "ms");
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
    conned_obj.setBarometricPressurePeriod(period, function() {
      conned_obj.notifyBarometricPressure(function() {
        //console.info("ready: notifyBarometricPressure");
        //console.info("notify period = " + period + "ms");
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
    conned_obj.setLuxometerPeriod(period, function() {
      conned_obj.notifyLuxometer(function() {
        //console.info("ready: notifyLuxometer");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('luxometerChange', function(lux) {
          //console.log('\tlux = %d', lux.toFixed(1));
          global.lux[conned_obj.id] = lux.toFixed(1);
        });
      });
    });
  });
}
 
var SensorTag = require('sensortag');

function discover(uuid) {
  SensorTag.discoverByUuid(uuid, function(sensorTag) {
    console.info("found: connect and setup ... (waiting 5~10 seconds)");
    sensorTag.connectAndSetup(function() {
      discover(B);
      sensorTag.readDeviceName(function(error, deviceName) {
        console.info("connect: " + deviceName);
        //ti_simple_key(sensorTag);
        ti_gyroscope(sensorTag);
        ti_ir_temperature(sensorTag);
        ti_accelerometer(sensorTag);
        ti_humidity(sensorTag);
        //ti_magnetometer(sensorTag);
        ti_barometric_pressure(sensorTag);
        ti_luxometer(sensorTag);
      });
    });
    /* In case of SensorTag PowerOff or out of range when fired `onDisconnect` */
    sensorTag.on("disconnect", function() {
      console.info("disconnect and exit");
      fs.rename('data.csv', dateStr() + '.csv', function (err) {
      });
      process.exit(1);
    });
  });
}

discover(E);

function loop() {
  console.log("loop");
  var log = timeStr() + '\t' + global.obj_temp[B] + '\t' + global.temp[B] + '\t' + global.hum[B] + '\t' + global.accel_x[B] + '\t' + global.accel_y[B] + '\t' + global.accel_z[B] + '\t' + global.gyro_x[B] + '\t' + global.gyro_y[B] + '\t' + global.gyro_z[B] + '\t' + global.temp[E] + '\t' + global.hum[E] + '\t' + global.baro[E] + '\t' + global.lux[E];
  write('data.csv', log + '\n');
  console.log(log);
  setTimeout(loop, 60000);
}
// ヘッダー
write('data.csv', 'time\tbody-temperature\tbody-ambient-temperature\tbody-humidity\tbody-gyrodcope-x\tbody-gyrodcope-y\tbody-gyrodcope-z\tbody-accelerometer-x\tbody-accelerometer-y\tbody-accelerometer-z\ttemperature\thumidity\tbarometer\tilluminometer\n');
setTimeout(loop, 5000);

