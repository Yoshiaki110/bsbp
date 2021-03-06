var SensorTag = require('sensortag');
var async = require('async');

var USE_READ = true;
//var USE_READ = false;

SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });
  test(sensorTag);
});

function test(sensorTag) {
  async.series([
      function(callback) {
        console.log('connectAndSetUp');
        sensorTag.connectAndSetUp(callback);
      },
      function(callback) {
        console.log('readBatteryLevel');
        sensorTag.readBatteryLevel(function(error, batteryLevel) {
          console.log('\tbattery level = ' + batteryLevel);
          callback();
        });
      },
      function(callback) {
        console.log('enableIrTemperature');
        sensorTag.enableIrTemperature(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readIrTemperature');
          sensorTag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
            console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
            console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
            console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1))
          });

          console.log('setIrTemperaturePeriod');
          sensorTag.setIrTemperaturePeriod(500, function(error) {
            console.log('notifyIrTemperature');
            sensorTag.notifyIrTemperature(function(error) {
              setTimeout(function() {
                console.log('unnotifyIrTemperature');
                sensorTag.unnotifyIrTemperature(callback);
              }, 5000);
            });
          });
        }
      },
      function(callback) {
        console.log('disableIrTemperature');
        sensorTag.disableIrTemperature(callback);
      },
      function(callback) {
        console.log('enableAccelerometer');
        sensorTag.enableAccelerometer(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readAccelerometer');
          sensorTag.readAccelerometer(function(error, x, y, z) {
            console.log('\tx = %d G', x.toFixed(1));
            console.log('\ty = %d G', y.toFixed(1));
            console.log('\tz = %d G', z.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('accelerometerChange', function(x, y, z) {
            console.log('\tx = %d G', x.toFixed(1));
            console.log('\ty = %d G', y.toFixed(1));
            console.log('\tz = %d G', z.toFixed(1));
          });

          console.log('setAccelerometerPeriod');
          sensorTag.setAccelerometerPeriod(500, function(error) {
            console.log('notifyAccelerometer');
            sensorTag.notifyAccelerometer(function(error) {
              setTimeout(function() {
                console.log('unnotifyAccelerometer');
                sensorTag.unnotifyAccelerometer(callback);
              }, 5000);
            });
          });
        }
      },
      function(callback) {
        console.log('disableAccelerometer');
        sensorTag.disableAccelerometer(callback);
      },
      function(callback) {
        console.log('enableHumidity');
        sensorTag.enableHumidity(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readHumidity');
          sensorTag.readHumidity(function(error, temperature, humidity) {
            console.log('\ttemperature = %d °C', temperature.toFixed(1));
            console.log('\thumidity = %d %', humidity.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('humidityChange', function(temperature, humidity) {
            console.log('\ttemperature = %d °C', temperature.toFixed(1));
            console.log('\thumidity = %d %', humidity.toFixed(1));
          });

          console.log('setHumidityPeriod');
          sensorTag.setHumidityPeriod(500, function(error) {
            console.log('notifyHumidity');
            sensorTag.notifyHumidity(function(error) {
              setTimeout(function() {
                console.log('unnotifyHumidity');
                sensorTag.unnotifyHumidity(callback);
              }, 5000);
            });
          });
        }
      },
      function(callback) {
        console.log('disableHumidity');
        sensorTag.disableHumidity(callback);
      },
      function(callback) {
        console.log('enableMagnetometer');
        sensorTag.enableMagnetometer(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readMagnetometer');
          sensorTag.readMagnetometer(function(error, x, y, z) {
            console.log('\tx = %d μT', x.toFixed(1));
            console.log('\ty = %d μT', y.toFixed(1));
            console.log('\tz = %d μT', z.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('magnetometerChange', function(x, y, z) {
            console.log('\tx = %d μT', x.toFixed(1));
            console.log('\ty = %d μT', y.toFixed(1));
            console.log('\tz = %d μT', z.toFixed(1));
          });

          console.log('setMagnetometerPeriod');
          sensorTag.setMagnetometerPeriod(500, function(error) {
            console.log('notifyMagnetometer');
            sensorTag.notifyMagnetometer(function(error) {
              setTimeout(function() {
                console.log('unnotifyMagnetometer');
                sensorTag.unnotifyMagnetometer(callback);
              }, 5000);
            });
          });
        }
      },
      function(callback) {
        console.log('disableMagnetometer');
        sensorTag.disableMagnetometer(callback);
      },
      function(callback) {
        console.log('enableBarometricPressure');
        sensorTag.enableBarometricPressure(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readBarometricPressure');
          sensorTag.readBarometricPressure(function(error, pressure) {
            console.log('\tpressure = %d mBar', pressure.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('barometricPressureChange', function(pressure) {
            console.log('\tpressure = %d mBar', pressure.toFixed(1));
          });

          console.log('setBarometricPressurePeriod');
          sensorTag.setBarometricPressurePeriod(500, function(error) {
            console.log('notifyBarometricPressure');
            sensorTag.notifyBarometricPressure(function(error) {
              setTimeout(function() {
                console.log('unnotifyBarometricPressure');
                sensorTag.unnotifyBarometricPressure(callback);
              }, 5000);
            });
          });
        }
      },
      function(callback) {
        console.log('disableBarometricPressure');
        sensorTag.disableBarometricPressure(callback);
      },
      function(callback) {
        console.log('enableGyroscope');
        sensorTag.enableGyroscope(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readGyroscope');
          sensorTag.readGyroscope(function(error, x, y, z) {
            console.log('\tx = %d °/s', x.toFixed(1));
            console.log('\ty = %d °/s', y.toFixed(1));
            console.log('\tz = %d °/s', z.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('gyroscopeChange', function(x, y, z) {
            console.log('\tx = %d °/s', x.toFixed(1));
            console.log('\ty = %d °/s', y.toFixed(1));
            console.log('\tz = %d °/s', z.toFixed(1));
          });

          console.log('setGyroscopePeriod');
          sensorTag.setGyroscopePeriod(500, function(error) {
            console.log('notifyGyroscope');
            sensorTag.notifyGyroscope(function(error) {
              setTimeout(function() {
                console.log('unnotifyGyroscope');
                sensorTag.unnotifyGyroscope(callback);
              }, 5000);
            });
          });
        }
      },
      function(callback) {
        console.log('disableGyroscope');
        sensorTag.disableGyroscope(callback);
      },


      function(callback) {
        console.log('enableLuxometer');
        sensorTag.enableLuxometer(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        if (USE_READ) {
          console.log('readLuxometer');
          sensorTag.readLuxometer(function(error, lux) {
            console.log('\tlux = %d', lux.toFixed(1));

            callback();
          });
        } else {
          sensorTag.on('luxometerChange', function(lux) {
            console.log('\tlux = %d', lux.toFixed(1));
          });

          console.log('setLuxometer');
          sensorTag.setLuxometerPeriod(500, function(error) {
            console.log('notifyLuxometer');
            sensorTag.notifyLuxometer(function(error) {
              setTimeout(function() {
                console.log('unnotifyLuxometer');
                sensorTag.unnotifyLuxometer(callback);
              }, 5000);
            });
          });
        }
      },

      function(callback) {
        console.log('disconnect');
        sensorTag.disconnect(callback);
      }
    ]
  );
}
