var db = require('mongo_schemas');
var _ = require('lodash');


module.exports = (function() {
  var _return = {};

  _return.get = function(req, res, next) {
    next();
  };

  _return.post = function(req, res) {
    if (_.includes(req.user._permissions, "root")) { // todo temp permissions
      if (req.body && req.body.data && req.body.data.mobile) {
        change_password(req.body.data.mobile);
      } else res.json({
        err: "low args"
      });
    }
  };

  return _return;
})();


function change_password(mobile, cb) {
  cb = cb || function() {};
  var new_password = String.password_generator();
  db.users.findOne({
    mobile: String.enc_mobile(mobile)
  }, function(err, u) {
    encrypt.hash(new_password, function(hash) {
      u.password = hash;
      u.save(function(err, user) {
        if (err) {
          console.log(err);
          cb(false);
        } else {
          var data = {
            to: mobile,
            message: "new password : " + new_password
          };
          console.log(req.user.first_name + " " + req.user.last_name + " change " + user.last_name + " " + user.last_name + " password");
          require('send_sms_log')(data, "reply");
          cb(true);
        }
      })
    });
  });
}
