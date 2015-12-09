var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        if (req.query && req.query.type == "all") {
            db.rememberance.find({}, {
                __v: false,
                text: false
            }).lean().exec(function(err,
                rememberances) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        add: false,
                        err: err
                    });
                } else {
                    res.json(rememberances);
                }
            })
        } else if (req.query && req.query.type == "single" && req.query
            ._id) {
            db.rememberance.findOne({
                _id: req.query
                    ._id
            }, {
                _id: false,
                __v: false
            }).lean().exec(function(err,
                rememberances) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        add: false,
                        err: err
                    });
                } else {
                    res.json(rememberances);
                }
            })
        }
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
        } else if (req.user && req.body.type == "like") {
            // add
        }
    };

    return _return;
})();
