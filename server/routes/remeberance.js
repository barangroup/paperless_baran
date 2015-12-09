var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        if (req.query && req.query.type == "all") {
            db.rememberance.find({}, {
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
        } else if (req.user && req.body.type == "like" && req.body.data &&
            req.body.data._remeberance_id) {
            db.remeberance.update({
                _id: _remeberance_id
            }, {
                $addToSet: {
                    like: req.user._id
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        like: false,
                        err: err
                    });
                } else {
                    res.json({
                        like: true
                    });
                }
            });
        } else if (req.user && req.body.type == "comment" && req.body
            .data && req.body.data._remeberance_id && req.body.data
            .text) {
            db.remeberance.update({
                _id: _remeberance_id
            }, {
                $addToSet: {
                    comment: {
                        _writer: req.user._id,
                        text: req.body.data.text
                    }
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        comment: false,
                        err: err
                    });
                } else {
                    res.json({
                        comment: true
                    });
                }
            });
        }
    };

    return _return;
})();
