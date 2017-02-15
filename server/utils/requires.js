// this file is just for connecting to other js files
// from app .actually it's for less codes in app.js
require('date-utils');
require('colors');
require('my_utils');
require('../testing');
require('../mongo/init');
require('../cron/birth_day_sms');
require('../cron/log_remover');
require('../cron/sms_credit');
require('../sms/sms_receiver');


var fs = require('fs');
var path = require('path');

fs.exists(path.join(__dirname + './../node_modules/encrypt_module.js'), function(exists) {

  if (exists) require('encrypt_module');
  else {
    String.enc_mobile = function(mobile) {
      return mobile;
    }

    String.dec_mobile = function(mobile) {
      return mobile;
    }
  }
});
