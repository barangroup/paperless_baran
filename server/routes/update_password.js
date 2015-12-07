var date_convert = require('date');
var db = require('mongo_schemas');
var _ = require('lodash');
var encrypt = require('encrypt');

module.exports.get = function(req, res, next) {
    next();
};

module.exports.post = function(req, res, next) {

    if (req.user && req.user._permissions && (_.includes(req.user._permissions,
                "root") ||
            _.includes(req.user._permissions, "edit_users"))) {
        var user = String.remove_empty_data(req.body);

        if (user._id && user.password) {
            var pass = user.password;
            db.users.findOne({
                _id: user._id
            }, function(err, u) {
                if (err) console.log(err);
                else if (u) {
                    encrypt.hash(user.password, function(hash) {
                        u.password = hash;
                        u.save(function(err, user) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (typeof user.send_sms !=
                                    undefined) {
                                    require(
                                        'send_sms_log'
                                    )({
                                            to: String
                                                .dec_mobile(
                                                    u
                                                    .mobile
                                                ),
                                            message: "your new password in panel.barang.ir site is : \n" +
                                                pass
                                        },
                                        "send"
                                    );
                                }
                                console.log(
                                    "admin -> " +
                                    req.user.first_name +
                                    " " + req.user
                                    .first_name +
                                    " " +
                                    " change password -> " +
                                    u.first_name +
                                    " " + u.last_name
                                );
                                res.json({
                                    edit: true
                                });
                            }
                        })
                    });
                } else {
                    res.json({
                        edit: false
                    });
                    console.log(
                        "not valid user in /update_password route."
                    );
                }
            });
        } else {

            console.log(req.user.first_name + " " + req.user.last_name +
                " " +
                "try to edit a user without _id or password parameter");
        }
    } else {
        next();
        if (req.user) console.log(req.user.first_name + " " + req.user.last_name +
            " " +
            "try to change a user's password without having permission!!!"
        );
        else console.log(
            "someone try to change a user's password without having permission!!!"
        );

    }
};
