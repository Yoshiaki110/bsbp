/*
参考
http://info-i.net/csv-parse
https://qiita.com/daikiojm/items/28be6d7c87db6ea7c74b
*/

var fs = require('fs');
var csvSync = require('csv-parse/lib/sync');

aggregate('data.csv');

function aggregate(file) {
  var raw = fs.readFileSync(file);
  var res = csvSync(raw, {
    delimiter: '\t',
    columns: null
  });
  
  var body_temp_sum = 0;
  var body_temp_cnt = 0;
  var body_amb_temp_sum = 0;
  var body_amb_temp_cnt = 0;
  var body_hum_sum = 0;
  var body_hum_cnt = 0;
  var gyro_x_sum = 0;
  var gyro_x_cnt = 0;
  var gyro_y_sum = 0;
  var gyro_y_cnt = 0;
  var gyro_z_sum = 0;
  var gyro_z_cnt = 0;
  var accel_x_sum = 0;
  var accel_x_cnt = 0;
  var accel_y_sum = 0;
  var accel_y_cnt = 0;
  var accel_z_sum = 0;
  var accel_z_cnt = 0;
  var temp_sum = 0;
  var temp_cnt = 0;
  var hum_sum = 0;
  var hum_cnt = 0;
  var baro_sum = 0;
  var baro_cnt = 0;
  var lux_sum = 0;
  var lux_cnt = 0;

  console.log(res.length);
  for (var i = 0; i < res.length; i++) {
    if (res[i][0] < '0000' || res[i][0] > '1259') {
      console.log(res[i][0]);
      continue;
    }
    console.log(res[i][0], res[i][1], res[i][2], res[i][3], res[i][10], res[i][11], res[i][12], res[i][13]);
    if (res[i][1] < 60  && res[i][1] > -10) {  // -9-59
      body_temp_sum += res[i][1] - 0;
      ++body_temp_cnt;
    }
    if (res[i][2] < 60  && res[i][2] > -10) {  // -9-59
      body_amb_temp_sum += res[i][2] - 0;
      ++body_amb_temp_cnt;
    }
    if (res[i][3] < 100  && res[i][3] > 0) {  // 1-99
      body_hum_sum += res[i][3] - 0;
      ++body_hum_cnt;
    }
    if (res[i][10] < 60  && res[i][10] > -10) {  // -9-59
      temp_sum += res[i][10] - 0;
      ++temp_cnt;
    }
    if (res[i][11] < 100  && res[i][11] > 0) {  // 1-99
      hum_sum += res[i][11] - 0;
      ++hum_cnt;
    }
    if (res[i][12] < 1050  && res[i][12] > 500) {  // 501-1499
      baro_sum += res[i][12] - 0;
      ++baro_cnt;
    }
    if (res[i][13] < 5000  && res[i][13] >= 0) {  // 0-4999
      lux_sum += res[i][13] - 0;
      ++lux_cnt;
    }
  }
  console.log("body_temp", body_temp_sum, body_temp_cnt, body_temp_sum / body_temp_cnt);
  console.log("body_amb_temp", body_amb_temp_sum, body_amb_temp_cnt, body_amb_temp_sum / body_amb_temp_cnt);
  console.log("temp", temp_sum, temp_cnt, temp_sum / temp_cnt);
  console.log("hum", hum_sum, hum_cnt, hum_sum / hum_cnt);
  console.log("baro", baro_sum, baro_cnt, baro_sum / baro_cnt);
  console.log("lux", lux_sum, lux_cnt, lux_sum / lux_cnt);
}
