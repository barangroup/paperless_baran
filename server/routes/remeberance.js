var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        next();
    };

    _return.post = function(req, res, next) {
        // add rememberance is for users only
        // and other should register if wan to add
        if (req.user && req.body.type == "add") {
            new db.rememberance(req.body.data).save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        add: false,
                        err: err
                    });
                } else {
                    res.json({
                        add: true
                    });
                }
            });
        }
    };

    return _return;
})();
