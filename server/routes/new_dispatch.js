var _ = require('lodash');
var db = require('mongo_schemas');
var convert_date = require('date');


module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "add_dispatch")) {
            db.stations
                .find({}, {
                    name: true
                })
                .lean()
                .exec(function(err, re) {
                    res.json({
                        stations: String.remove_empty_data(re)
                    });
                });
        } else res.status(403).json({
            err: "premission denied"
        });
    };


    _return.post = function(req, res, next) {
        if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "add_dispatch")) {
            var dispatch = req.body;
            // if (!(_.includes(dispatch.members, String(req.user._id)))) {
            //     dispatch.members.push(req.user._id);
            // }
            var costs = req.body.costs;
            var cost_ids = [];

            var date = dispatch.date.split('/');

            convert_date.to_miladi({
                year: date[0],
                month: date[1],
                day: date[2]
            }, function(d) {
                dispatch.date = d;
            });

            String.sync_for(costs.length, function(loop) {
                var cost = costs[loop.iteration()];
                cost._owner = req.user._id;
                new db.mali(cost).save(function(err, data) {
                    if (err) {
                        console.log(err);
                        res.json({
                            save: false
                        });
                    } else if (data) {
                        cost_ids.push(data._id);
                        loop.next();
                    }
                });
            }, function() {
                dispatch.costs = cost_ids;
                dispatch._leader = req.user._id;

                new db.dispatch(dispatch).save(function(err, data) {
                    if (err) {
                        console.log(err);
                        res.json({
                            save: false
                        });
                    } else if (data) {
                        console.log(req.user.first_name + " " + req.user.last_name + " add a new dispatch.");
                        db.mali.update({
                            _id: {
                                $in: cost_ids
                            }
                        }, {
                            $set: {
                                _dispatch: data._id
                            }
                        }, {
                            multi: true
                        }, function(err, rr) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    save: false
                                });
                            } else if (rr) {
                                // console.log(rr);
                                res.json({
                                    save: true
                                });
                            }
                        });
                    }
                }); // new dispatch
            }); // exit callback
        } else res.status(403).json({
            err: "permission denied"
        });
    };

    return _return;
})();