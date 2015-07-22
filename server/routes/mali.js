var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "mali")) {
            db.mali.find({}, {
                __v: false
            }).populate({
                path: '_owner',
                select: 'first_name last_name -_id'
            }).populate({
                path: '_dispatch',
                select: '_station -_id'
            }).lean().exec(function(err, m) {
                if (err) {
                    console.log(err);
                    res.json({
                        err: err
                    });
                } else {
                    console.log(m.length);
                    String.sync_for(m.length, function(loop) {
                        db.dispatch.populate(m[loop.iteration()]._dispatch, {
                            path: '_station',
                            select: 'name -_id'
                        }, function(err, rr) {
                            if (err) {
                                console.log(err);
                            } else {
                                loop.next();
                            }
                        });
                    }, function() {
                        res.json(m)
                    });
                }
            });
        }
    };

    _return.post = function(req, res, next) {

        if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "add_cost")) {
            if (req.body.type == "add") {
                var mali = req.body.data || {};
                if (mali.cost && mali.comment) {
                    mali._owner = req.user._id;
                    new db.mali(mali).save(function(err) {
                        if (err) {
                            console.log(err);
                            res.json({
                                add: false
                            });
                        } else {
                            res.json({
                                add: true
                            });
                            console.log(req.user.first_name + " " + req.user.last_name + " add a mali.");
                        }
                    })
                } else res.json({
                    add: false
                });
            } else if (req.body.type == "edit" && req.body.data && req.body.data._id) {
                // comming soooooooooon
                next();
            } else res.json({
                error: "low args"
            });

        } else next();
    };

    return _return;
})();