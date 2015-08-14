var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {

        var _root = _.includes(req.user._permissions, "root"),
            _see_all_women = _.includes(req.user._permissions, "woman_mali"),
            _see_all_man = _.includes(req.user._permissions, "man_mali"),
            _see_all_users = (_see_all_man && _see_all_women);


        if ((_see_all_women || _see_all_man || _root)) {
            var query = {};
            if (!(_root || _see_all_users)) {
                if (_see_all_man)
                    query.gender = true;
                else if (_see_all_women)
                    query.gender = {
                        $exists: false
                    }
            }

            if (req.query.type == "list") {
                db.mali.find({}, {
                    _owner: true,
                    cost: true
                }).populate({
                    path: '_owner',
                    select: 'first_name last_name -_id',
                    match: query
                }).lean().exec(function(err, m) {
                    if (err) {
                        console.log(err);
                        res.json({
                            err: err
                        });
                    } else {
                        String.sync_for(m.length, function(loop) {
                            var i = loop.iteration();
                            if (m.length == 0) loop.break(true);
                            if (m[i] && m[i]._owner) {
                                db.dispatch.populate(m[i]._dispatch, {
                                    path: '_station',
                                    select: 'name -_id'
                                }, function(err, rr) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        loop.next();
                                    }
                                });
                            } else {
                                m.splice(i, 1);
                                loop.minmin();
                                loop.next();
                            }
                        }, function() {
                            res.json(m);
                        });
                    }
                });
            } else if (req.query.type == "get_data" && req.query._id) {
                db.mali.findOne({
                    _id: req.query._id
                }, {
                    __v: false
                }).populate({
                    path: '_owner',
                    select: 'first_name last_name -_id',
                    match: query
                }).populate({
                    path: '_dispatch',
                    select: '_station date -_id',
                }).lean().exec(function(err, m) {
                    if (err) {
                        console.log(err);
                        res.json({
                            err: err
                        });
                    } else if (m) {
                        if (m._owner) {
                            db.dispatch.populate(m._dispatch, {
                                path: '_station',
                                select: 'name -_id'
                            }, function(err, rr) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (m._dispatch && m._dispatch.date) {
                                        Date.en_to_persion_date(m._dispatch.date, function(date) {
                                            m._dispatch.date = date.date;
                                        });
                                    }
                                    res.json(m);
                                }
                            });
                        } else {
                            res.status(403).json({
                                err: "permission denied"
                            });
                        }
                    }
                });
            }

            // Old starategy

            // db.mali.find({}, {
            //     __v: false
            // }).populate({
            //     path: '_owner',
            //     select: 'first_name last_name -_id',
            //     match: query
            // }).populate({
            //     path: '_dispatch',
            //     select: '_station -_id'
            // }).lean().exec(function(err, m) {
            //     if (err) {
            //         console.log(err);
            //         res.json({
            //             err: err
            //         });
            //     } else {
            //         String.sync_for(m.length, function(loop) {
            //             var i = loop.iteration();
            //             if (m.length == 0) loop.break(true);
            //             if (m[i] && m[i]._owner) {
            //                 db.dispatch.populate(m[i]._dispatch, {
            //                     path: '_station',
            //                     select: 'name -_id'
            //                 }, function(err, rr) {
            //                     if (err) {
            //                         console.log(err);
            //                     } else {
            //                         loop.next();
            //                     }
            //                 });
            //             } else {
            //                 m.splice(i, 1);
            //                 loop.minmin();
            //                 loop.next();
            //             }
            //         }, function() {
            //             res.json(m.slice(req.query.from, req.query.to)); // memory leak here!
            //         });
            //     }
            // });
        } else res.status(403).json({
            err: "permission denied"
        });
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
                err: "low args"
            });

        } else next();
    };

    return _return;
})();