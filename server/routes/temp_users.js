var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res) {
        res.render('temp_user');
    };

    _return.post = function(req, res) {
        // console.open(req.body);
        if (req.body && req.body.mobile) {
            db.temp_users.findOne({
                mobile: req.body.mobile
            }, {
                _id: true
            }).lean().exec(function(err, _rr) {
                // console.open(_rr);
                if (err) {
                    console.log(err);
                    res.json({
                        err: err
                    });
                } else if (!_rr) {
                    new db.temp_users(req.body).save(function(err) {
                        if (err) {
                            res.json({
                                err: err
                            });
                        } else {
                            res.redirect('/temp_users');
                            console.log(req.user.first_name + " " + req.user.last_name + " add new temp user!");
                        }
                    });
                } else if (_rr) {
                    // res.send("esists in db!");
                    res.redirect('/temp_users');
                    console.log("temp_user phone exist in db.");
                }
            });
        } else {
            res.json({
                err: "low args"
            });
        }
    };

    return _return;
})();