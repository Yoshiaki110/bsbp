/*
参考
http://info-i.net/csv-parse
https://qiita.com/daikiojm/items/28be6d7c87db6ea7c74b
*/

var fs = require('fs');
function write(fname, data) {
  try {
    var fd = fs.openSync(fname, "a");
    fs.writeSync(fd, data);
    fs.closeSync(fd);
  } catch (e) {
    console.log(e);
  }
}

var csvSync = require('csv-parse/lib/sync');

//exports.aggregate('data.csv', 'result.csv', '20171022');

exports.aggregate = function(infile, outfile, date) {
//function aggregate(infile, outfile, date) {
  var raw = fs.readFileSync(infile);
  var res = csvSync(raw, {
    delimiter: '\t',
    columns: null
  });
  
  var bedtime = '';
  var getuptime = '';
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
  var accel_x_cnt = 0;
  var accel_y_cnt = 0;
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
    if (bedtime == '') {
      bedtime = res[i][0];
    }
    getuptime = res[i][0];
    console.log(res[i][0], res[i][1], res[i][2], res[i][3], res[i][7], res[i][8], res[i][9],res[i][10], res[i][11], res[i][12], res[i][13]);
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
    if (res[i][7] < 20  && res[i][7] > -20) {  // -19-19
      if (chk_accel(res[i-1][7], res[i][7])) {
        ++accel_x_cnt;
      }
    }
    if (res[i][8] < 20  && res[i][8] > -20) {  // -19-19
      if (chk_accel(res[i-1][8], res[i][8])) {
        ++accel_y_cnt;
      }
    }
    if (res[i][9] < 20  && res[i][9] > -20) {  // -19-19
      if (chk_accel(res[i-1][9], res[i][9])) {
        ++accel_z_cnt;
      }
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
  console.log("body_hum", body_hum_sum, body_hum_cnt, body_hum_sum / body_hum_cnt);
  console.log("temp", temp_sum, temp_cnt, temp_sum / temp_cnt);
  console.log("hum", hum_sum, hum_cnt, hum_sum / hum_cnt);
  console.log("baro", baro_sum, baro_cnt, baro_sum / baro_cnt);
  console.log("lux", lux_sum, lux_cnt, lux_sum / lux_cnt);

  var SEP = '\t';
// ヘッダー
  try {
    fs.statSync(outfile);
  } catch(err) {    // ファイルがなかったらヘッダーを書く
    write(outfile, 'date' + SEP + 'bedtime' + SEP + 'getuptime' + SEP + 'score' + SEP + 'comment1' + SEP + 'comment2' + SEP + 'comment3' + SEP + 'comment4' + SEP + 'body_temperature' + SEP + 'body_ambient_temperature' + SEP + 'body_humidity' + SEP + 'body_gyrodcope_x' + SEP + 'body_gyrodcope_y' + SEP + 'body_gyrodcope_z' + SEP + 'body_accelerometer_x' + SEP + 'body_accelerometer_y' + SEP + 'body_accelerometer_z' + SEP + 'temperature' + SEP + 'humidity' + SEP + 'barometer' + SEP + 'illuminometer\n');
  }
  write(outfile, date + SEP + bedtime + SEP + getuptime + SEP + SEP + SEP + SEP + SEP + SEP + ave(body_temp_sum, body_temp_cnt) + SEP + ave(body_amb_temp_sum, body_amb_temp_cnt) + SEP + ave(body_hum_sum, body_hum_cnt) + SEP + SEP + SEP + SEP + accel_x_cnt + SEP + accel_y_cnt + SEP + accel_z_cnt + SEP + ave(temp_sum, temp_cnt) + SEP + ave(hum_sum, hum_cnt) + SEP + ave(baro_sum, baro_cnt) + SEP + ave(lux_sum, lux_cnt) + '\n');
}

function chk_accel(a, b) {
  if (a < 20 && a > -20) {
    if (a < 0 && b > 0) {
      return true;
    }
    if (a > 0 && b < 0) {
      return true;
    }
  }
  return false;
}

function ave(sum, cnt) {
  if (cnt == 0) {
    return '';
  } else {
    return sum / cnt;
  }
}

//exports.aggregate('data.csv', 'result.csv', '20171022');

