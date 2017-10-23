//var SensorTag = require('sensortag');
var SensorTag = require('./index');
var async = require('async');

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
      // http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#IO_Service
      function(callback) {
        console.log('IO off');
        sensorTag.writeIoData(0, callback);
      },
      function(callback) {
        console.log('writeIoConfig - test mode');
        sensorTag.writeIoConfig(2, callback);
      },
      function(callback) {
        console.log('readIoConfig');
        sensorTag.readIoConfig(function(error, value) {
          console.log('readIoConfig error:' + error + ' value:' + value);
          setTimeout(callback, 1000);
        });
      },
      function(callback) {
        console.log('readIoData');
        sensorTag.readIoData(function(error, value) {
          console.log('readIoData error:' + error + ' value:' + value);
          if (value & 1) {
            console.log('OK IR temperature sensor');
          } else {
            console.log('NG IR temperature sensor');
          }
          if (value & 2) {
            console.log('OK Humidity sensor');
          } else {
            console.log('NG Humidity sensor');
          }
          if (value & 4) {
            console.log('OK Optical sensor');
          } else {
            console.log('NG Optical sensor');
          }
          if (value & 8) {
            console.log('OK Pressure sensor');
          } else {
            console.log('NG Pressure sensor');
          }
          if (value & 16) {
            console.log('OK MPU');
          } else {
            console.log('NG MPU');
          }
          if (value & 32) {
            console.log('OK Magnetometer');
          } else {
            console.log('NG Magnetometer');
          }
          if (value & 64) {
            console.log('OK External Flash');
          } else {
            console.log('NG External Flash');
          }
          setTimeout(callback, 1000);
        });
      },
      function(callback) {
        console.log('IO off');
        sensorTag.writeIoData(0, callback);
      },
      function(callback) {
        console.log('disconnect');
        sensorTag.disconnect(callback);
      }
    ]
  );
}

