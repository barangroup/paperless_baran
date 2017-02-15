var db = require('mongo_schemas');
var sms_send = require('send_sms');

var time_out = global.init.income_sms_loop_time * 1000;

function find_owner(sms, callback) {
  callback = callback || function() {};

  db.users.findOne({
    mobile: String.enc_mobile(sms.sender)
  }, {
    _id: true
  }).lean().exec(function(err, u) {
    if (err) {
      console.log(err);
    } else if (u) {
      sms._owner = u._id;
      save_sms(sms);
    } else {
      save_sms(sms)
    }
  });

}

function save_sms(sms) {
  // console.open(sms);

  new db.income_sms_archive(sms)
    .save(function(err, data) {
      if (err) {
        console.log(err);
      } else if (data) {
        console.log(data.message);
        require('./reply')(sms);
      }
    });
}

function sms_loop() {
  sms_send.unread({}, function(data) {
    setTimeout(sms_loop, time_out);
    if (data && data.return && data.return.status == 200 && data.entries) {
      console.log('new income_sms -> ' + data.entries.length);
      data.entries.forEach(function(sms) {
        find_owner(sms);
      });
    } else if (data.error) {
      console.err("error in unread messages -> " + data.error);
    }
  })
}

if (global.init.income_sms) {
  setTimeout(sms_loop, time_out);
}
