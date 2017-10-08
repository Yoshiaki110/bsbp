require('date-utils');
function datetimeStr() {
  var now = new Date();
  return now.toFormat('YYYYMMDDHH24MISS');
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


var SensorTag = require('sensortag');

console.info("waiting for connect");
global.obj_temp = {};
global.temp = {};
global.accel_x = {};
global.accel_y = {};
global.accel_z = {};
global.hum = {};
global.baro = {};
global.lux = {};

function ti_ir_temperature(conned_obj, period) {
  conned_obj.enableIrTemperature(function() {
    conned_obj.setIrTemperaturePeriod(period, function() {
      conned_obj.notifyIrTemperature(function() {
        //console.info("ready: notifyIrTemperature");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
          //console.log(conned_obj.id, '\tobject temperature = %d °C', objectTemperature.toFixed(1));
          //console.log(conned_obj.id,'\tambient temperature = %d °C', ambientTemperature.toFixed(1));
          global.obj_temp[conned_obj.id] = objectTemperature.toFixed(1);
          global.temp[conned_obj.id] = ambientTemperature.toFixed(1);
        });
      });
    });
  });
}
 
function ti_accelerometer(conned_obj, period) {
  conned_obj.enableAccelerometer(function() {
    conned_obj.setAccelerometerPeriod(period, function() {
      conned_obj.notifyAccelerometer(function() {
        //console.info("ready: notifyAccelerometer");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('accelerometerChange', function(x, y, z) {
          //console.log(conned_obj.id, '\taccel_x = %d G', x.toFixed(1), 'accel_y = %d G', y.toFixed(1), 'accel_z = %d G', z.toFixed(1));
          global.accel_x[conned_obj.id] = x.toFixed(1);
          global.accel_y[conned_obj.id] = y.toFixed(1);
          global.accel_z[conned_obj.id] = z.toFixed(1);
        });
      });
    });
  });
}
 
function ti_humidity(conned_obj, period) {
  conned_obj.enableHumidity(function() {
    conned_obj.setHumidityPeriod(period, function() {
      conned_obj.notifyHumidity(function() {
        //console.info("ready: notifyHumidity");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('humidityChange', function(temperature, humidity) {
          //console.log(conned_obj.id, '\ttemperature = %d °C', temperature.toFixed(1));
          //console.log(conned_obj.id, '\thumidity = %d %', humidity.toFixed(1));
          global.temp[conned_obj.id] = temperature.toFixed(1);
          global.hum[conned_obj.id] = humidity.toFixed(1);
        });
      });
    });
  });
}
 
function ti_barometric_pressure(conned_obj, period) {
  conned_obj.enableBarometricPressure(function() {
    conned_obj.setBarometricPressurePeriod(period, function() {
      conned_obj.notifyBarometricPressure(function() {
        //console.info("ready: notifyBarometricPressure");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('barometricPressureChange', function(pressure) {
          //console.log(conned_obj.id, '\tpressure = %d mBar', pressure.toFixed(1));
          global.baro[conned_obj.id] = pressure.toFixed(1);
        });
      });
    });
  });
}
 
function ti_luxometer(conned_obj, period) {
  conned_obj.enableLuxometer(function() {
    conned_obj.setLuxometerPeriod(period, function() {
      conned_obj.notifyLuxometer(function() {
        //console.info("ready: notifyLuxometer");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('luxometerChange', function(lux) {
          //console.log(conned_obj.id, '\tlux = %d', lux.toFixed(1));
          global.lux[conned_obj.id] = lux.toFixed(1);
        });
      });
    });
  });
}
 
var sensor1 = false;
var onDiscover1 = function(sensorTag) {
  sensorTag.connectAndSetup(function() {
    console.info("connect 1", sensorTag.id);
    sensor1 = true;
    if (!sensor2) {
      SensorTag.discover(onDiscover2);
    }
    sensorTag.readDeviceName(function(error, deviceName) {
      console.info("connect 2", sensorTag.id);
      ti_ir_temperature(sensorTag, 2000);
      ti_accelerometer(sensorTag, 2000);
      ti_humidity(sensorTag, 2000);
      ti_barometric_pressure(sensorTag, 2000);
      ti_luxometer(sensorTag, 2000);
    });
  });
  sensorTag.on("disconnect", function() {
    console.info("disconnect", sensorTag.id);
    sensor1 = false;
    SensorTag.discover(onDiscover1);
  });
};

var sensor2 = false;
var onDiscover2 = function(sensorTag) {
  sensorTag.connectAndSetup(function() {
    console.info("connect 1", sensorTag.id);
    sensor2 = true;
    if (!sensor1) {
      SensorTag.discover(onDiscover1);
    }
    sensorTag.readDeviceName(function(error, deviceName) {
      console.info("connect 2", sensorTag.id);
      ti_ir_temperature(sensorTag, 2000);
      ti_accelerometer(sensorTag, 2000);
      ti_humidity(sensorTag, 2000);
      ti_barometric_pressure(sensorTag, 2000);
      ti_luxometer(sensorTag, 2000);
    });
  });
  sensorTag.on("disconnect", function() {
    console.info("disconnect", sensorTag.id);
    sensor2 = false;
    SensorTag.discover(onDiscover2);
  });
};

SensorTag.discover(onDiscover1);


function loop() {
  console.log("loop");
  for (key in global.lux) {
    console.log(key + '\t' + datetimeStr() + '\t' + global.obj_temp[key] + '\t' + global.temp[key] + '\t' + global.accel_x[key] + '\t' + global.accel_y[key] + '\t' + global.accel_z[key] + '\t' + global.hum[key] + '\t' + global.baro[key] + '\t' + global.lux[key] );
    write(key + '.csv', datetimeStr() + '\t' + global.obj_temp[key] + '\t' + global.temp[key] + '\t' + global.accel_x[key] + '\t' + global.accel_y[key] + '\t' + global.accel_z[key] + '\t' + global.hum[key] + '\t' + global.baro[key] + '\t' + global.lux[key] );
  }
  setTimeout(loop, 10000);
}
setTimeout(loop, 10000);


var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static('public'));

app.get('/api/setting', function(req, res) {
  var d = JSON.parse(fs.readFileSync('setting.json', 'utf8'));
  console.log('d', d);
  console.log('d.sex', d.sex);
  console.log('d.interval', d.interval);
  res.json(d);
});
app.post('/api/setting', function(req, res) {
  console.log('req.body', req.body);
  var str = JSON.stringify(req.body, null, '  ');
  console.log('str', str);
  fs.writeFileSync('setting.json', str);
  res.json(req.body);
});
/*
app.get('/', function(req, res) {
  console.log(req);
  var d = { hum: 12.3, lux: 67.8 };
  res.json(JSON.stringify(d));
});
app.post('/', function(req, res) {
  console.log(req.body);
  var d = { hum: 12.3, lux: 67.8 };
  res.json(JSON.stringify(d));
});
*/
app.listen(80);
