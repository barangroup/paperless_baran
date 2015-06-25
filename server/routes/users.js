// this route is for ensani and in addition to permissions it send data of users

//var encrypt = require('encrypt');
var db = require('mongo_schemas');
var _ = require('lodash');
var date = require('date');

module.exports.get = function(req, res) {

    if (req.user && req.query && req.query.search) {
        var _root = _.includes(req.user._permissions, "root"),
            _see_all_women = _.includes(req.user._permissions, "see_woman_names"),
            _see_all_man = _.includes(req.user._permissions, "see_man_names"),
            _see_all_users = (_see_all_man && _see_all_women);

        var query = {};
        if (_root || _see_all_man || _see_all_women || _see_all_users) {

            query.$or = [{
                first_name: new RegExp(req.query.search)
            }, {
                last_name: new RegExp(req.query.search)
            }, ];

            if (!(_see_all_users || _root)) {
                if (_see_all_man) {
                    query.gender = true;
                } else if (_see_all_women) {
                    query.gender = {
                        $exists: false
                    };
                }
            }

            db.users.find(query, {
                first_name: true,
                last_name: true
            }).limit(10).lean().exec(function(err, users) {
                if (err) {
                    console.log(err);
                    res.json({
                        err: true
                    });
                } else if (users) {
                    var _res = [];
                    users.forEach(function(user) {
                        _res.push({
                            _id: user._id,
                            name: user.first_name + " " + user.last_name
                        });
                    });
                    res.json(_res);
                }
            });

        } else res.json({});
    } else res.json({
        err: "low args"
    });
};

module.exports.post = function(req, res, next) {

    if (req.user) {

        var _root = _.includes(req.user._permissions, "root"),
            _see_all_women = _.includes(req.user._permissions, "see_all_woman_users"),
            _see_all_man = _.includes(req.user._permissions, "see_all_man_users"),
            _see_all_users = (_see_all_man && _see_all_women);



        if (req.body && req.body.query && !(_see_all_users || _root))
            delete req.body.query.gender;

        var query = req.body.query || {};


        if (!(_see_all_users || _root)) {
            if (_see_all_man) {
                query.gender = true;
            } else if (_see_all_women) {
                query.gender = {
                    $exists: false
                };
            }
        }


        if (_see_all_man || _see_all_women || _see_all_users || _root) {

            if (req.body.from && req.body.to) {

                var from = Math.abs(req.body.from),
                    to = Math.abs(req.body.to);
                if (from > to) to = [from, from = to][0]; // swap(from,to);
                else if (from == to) to++;


                if (query.quick_search) {
                    query.$or = [{
                        first_name: new RegExp(query.quick_search)
                    }, {
                        last_name: new RegExp(query.quick_search)
                    }, ];
                    delete query.quick_search;
                }

                if (query.mobile) query.mobile = String.enc_mobile(query.mobile);
                if (query.first_name) query.first_name = new RegExp(query.first_name);
                if (query.last_name) query.last_name = new RegExp(query.last_name);
                if (query.city) query.city = new RegExp(query.city);


                db.users.count(query, function(err, c) {
                    db.users.find(query, {
                            __v: false,
                            password: false
                        })
                        .sort({
                            _id: -1
                        })
                        .populate({
                            path: '_creator',
                            select: 'first_name last_name -_id'
                        }).populate({
                            path: 'task',
                            select: 'title'
                        })
                        .populate({
                            path: '_comments._writer',
                            select: 'first_name last_name -_id'
                        })
                        .skip(from)
                        .limit(to - from)
                        .lean()
                        .exec(function(err, users) {
                            // console.log(users.length);
                            if (err) {
                                console.log(err);
                                res.json({});
                            } else if (users) {
                                String.sync_for(users.length, function(loop) {
                                        if (global.init.real_mobile_numbers) users[loop.iteration()].mobile = String.dec_mobile(users[loop.iteration()].mobile);

                                        Date.en_to_persion_date(users[loop.iteration()]._id.getTimestamp(), function(d) {
                                            users[loop.iteration()].create_date = d.date;
                                            users[loop.iteration()].create_time = d.time;
                                            if (users[loop.iteration()].birth_date) {
                                                Date.en_to_persion_date(users[loop.iteration()].birth_date, function(d2) {
                                                    users[loop.iteration()].birth_date = d2.date;
                                                    loop.next();
                                                });
                                            } else
                                                loop.next();
                                        });
                                    },
                                    function() {
                                        res.json({
                                            count: c,
                                            data: users
                                        });
                                    });
                            } else res.json({
                                count: 0,
                                data: []
                            });
                        });
                });

            } else {
                db.users.count(query, function(err, c) {
                    if (err) {
                        console.log(err);
                    } else if (c) {
                        var r = {
                            total_count: c
                        };
                        if (_.includes(req.user._permissions, "edit_users")) {
                            r.can_edit = true;
                        }
                        res.json(r);
                    }
                })
            }
        } else res.json({});
    } else next();
};