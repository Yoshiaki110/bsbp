var SensorTag = require('sensortag');

console.info("waiting for connect");

var obj_temp = {};
var temp = {};
var taccel_x = {};
var taccel_y = {};
var taccel_z = {};
var hum = {};
var baro = {};
var lux = {};

function ti_ir_temperature(conned_obj, period) {
  conned_obj.enableIrTemperature(function() {
    conned_obj.setIrTemperaturePeriod(period, function() {
      conned_obj.notifyIrTemperature(function() {
        //console.info("ready: notifyIrTemperature");
        //console.info("notify period = " + period + "ms");
        conned_obj.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
          console.log(conned_obj.id, '\tobject temperature = %d °C', objectTemperature.toFixed(1));
          console.log(conned_obj.id,'\tambient temperature = %d °C', ambientTemperature.toFixed(1));
          obj_temp[conned_obj.id] = objectTemperature.toFixed(1);
          temp[conned_obj.id] = ambientTemperature.toFixed(1);
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
          console.log(conned_obj.id, '\taccel_x = %d G', x.toFixed(1), 'accel_y = %d G', y.toFixed(1), 'accel_z = %d G', z.toFixed(1));
          taccel_x[conned_obj.id] = x.toFixed(1);
          taccel_y[conned_obj.id] = y.toFixed(1);
          taccel_z[conned_obj.id] = z.toFixed(1);
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
          console.log(conned_obj.id, '\ttemperature = %d °C', temperature.toFixed(1));
          console.log(conned_obj.id, '\thumidity = %d %', humidity.toFixed(1));
          temp[conned_obj.id] = temperature.toFixed(1);
          hum[conned_obj.id] = humidity.toFixed(1);
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
          console.log(conned_obj.id, '\tpressure = %d mBar', pressure.toFixed(1));
          baro[conned_obj.id] = pressure.toFixed(1);
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
          console.log(conned_obj.id, '\tlux = %d', lux.toFixed(1));
          lux[conned_obj.id] = lux.toFixed(1);
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

