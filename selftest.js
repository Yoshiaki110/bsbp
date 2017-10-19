var SensorTag = require('sensortag');
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

