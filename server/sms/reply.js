var db = require('mongo_schemas');
var encrypt = require('encrypt');

module.exports = (function() {
    var temp = function(sms) {
        var message = sms.message;
        if (message == "#new password") {
            change_password(sms.sender);
        };
    }
    return temp;
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
                    console.log(user.first_name + " " + user.last_name + " change his/her password with SMS request");
                    require('send_sms_log')(data, "reply");
                    cb(true);
                }
            })
        });
    });
}