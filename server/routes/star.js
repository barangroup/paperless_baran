var db = require('mongo_schemas');
var _ = require('lodash');

// '/del' is exception, don't add it in include_guest_get Array

var include_guest_get = ['/', '/register', '/station'],
    exclude_ajax_post = ['/'];


var black_list = {};
var printed_black_list = {};

setInterval(function() {
    black_list = {};
    printed_black_list = {};
    // console.log("clean the IPs");
}, 60000);


module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {

        black_list[req.ip] = black_list[req.ip] + 1 || 1;

        if (black_list[req.ip] < global.init.req_per_min) {

            // console.log("get -> " + req.url);

            if (req.url == '/del') {
                next();
            } else if (req.session.q) {
                db.users.findOne({
                        _id: req.session.q
                    }, {
                        __v: false
                    })
                    .populate("task").lean().exec(
                        function(err, user) {
                            if (user) {
                                user._permissions = [];

                                if (user.task && user.task.length > 0) {
                                    user.task.forEach(function(t) {
                                        user._permissions = Array.merge(user._permissions, t.permissions);
                                    });
                                }
                                req.user = user;
                                next();
                            } else {
                                res.redirect('/del');
                            }
                        });
            } else if (_.includes(include_guest_get, req.url)) {
                next();
            } else {
                res.redirect('/del');
            }
        } else {
            res.status(403).send('u r blocked for sending too many request...');
            if (!printed_black_list[req.ip]) {
                console.log("*** too many requests from -> " + req.ip);
                printed_black_list[req.ip] = true;
            }

        }
    };

    _return.post = function(req, res, next) {

        black_list[req.ip] = black_list[req.ip] + 1 || 1;

        if (black_list[req.ip] < global.init.req_per_min) {
            // console.log("post -> " + req.url);
            if (req.session.q) {
                db.users.findOne({
                        _id: req.session.q
                    }, {
                        __v: false
                    })
                    .populate("task").lean().exec(
                        function(err, user) {
                            if (user) {
                                user._permissions = [];

                                if (user.task && user.task.length > 0) {
                                    user.task.forEach(function(t) {
                                        user._permissions = Array.merge(user._permissions, t.permissions);
                                    });
                                }

                                req.user = user;
                                next();
                            } else {
                                res.redirect('/del');
                            }
                        });
            } else next();
        } else {
            res.status(403).send('u r blocked for sending too many request...');
            if (!printed_black_list[req.ip]) {
                console.log("*** too many requests from -> " + req.ip);
                printed_black_list[req.ip] = true;
            }

        }
    };

    return _return;
})();