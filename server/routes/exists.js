var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        next();
    };

    _return.post = function(req, res, next) {
        if (req.body && req.body.mobile) {
            db.users.findOne({
                mobile: String.enc_mobile(req.body.mobile)
            }, {
                _id: true
            }).lean().exec(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result) {
                    res.json({
                        exists: true
                    });
                } else {
                    res.json({
                        exists: false
                    });
                };
            });
        } else next();
    }

    return _return;
})();