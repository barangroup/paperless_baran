var db = require('mongo_schemas');
var _ = require('lodash');


var permissions = [
    "root", // admin part
    "define_task_child",
    "logs",
    "news",
    "sms_root", // sms part
    "sms_to_child",
    "birthday_sms",
    "add_user", // ensani part
    "edit_users",
    "see_all_man_users",
    "see_all_woman_users",
    "see_all_man_users_notification",
    "see_all_woman_users_notification",
    "see_man_names",
    "see_woman_names",
    "users_report",
    "add_dispatch", // amoozesh part
    "stations",
    "see_all_man_dispatch",
    "see_all_woman_dispatch",
    "dispatch_report",
    "see_all_man_dispatch_notification",
    "see_all_woman_dispatch_notification",
    "man_mali", // mali part
    "woman_mali",
    "add_cost", // add hazine
    "mali_api",
    "mali_report",
    "mali_store",
    "see_all_mali_notification",
    "vote",
    "vote_counter"
];



module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        next();
    };

    _return.post = function(req, res, next) {
        /*
        data need to be something like this :
        {
            type : "add/list/edit/permissions" ,
            data : {}
        }
        */

        // console.open(req.body);
        if ((_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "task"))) {
            if (req.body && req.body.type == "add" && req.body.data &&
                req.body.data.name && req.body.data.title &&
                req.body.data._parent) {
                var task = req.body.data;
                task._creator = req.user._id;
                new db.tasks(task).save(function(err, data) {
                    if (err) {
                        console.log(err);
                        res.json({
                            add: false
                        });
                    } else if (data) {
                        res.json({
                            add: true,
                            data: data
                        });
                        // log it
                        console.log(req.user.first_name + " " + req.user.last_name + " add a new task -> " + data.title);
                    }
                });
            } else if (req.body && req.body.type == "list") {
                db.tasks.find({}, {
                        __v: false,
                        _creator: false
                    })
                    .sort({
                        _id: 1
                    })
                    .lean()
                    .exec(function(err, tasks) {
                        if (err) {
                            console.log(err);
                        } else if (tasks) {
                            res.json(tasks);
                        }
                    });
            } else if (req.body && req.body.type == "edit" && req.body
                .data) {
                db.tasks.findOne({
                    _id: req.body.data._id
                }, function(err, task) {
                    if (err) {
                        console.log(err);
                    } else if (task) {
                        if (req.body.data.title)
                            task.title = req.body.data.title;
                        if (req.body.data.name)
                            task.name = req.body.data.name;

                        if (req.body.data._parent)
                            task._parent = req.body.data._parent;

                        if (req.body.data.permissions)
                            task.permissions = req.body.data.permissions;

                        task.wf_contacts = req.body.data.wf_contacts;

                        if (req.body.data._disable)
                            task._disable = true;
                        else
                            task._disable = undefined;

                        task.save(function(err) {
                            if (err) {
                                console.log(err);
                                res.json({
                                    edit: false,
                                    err: "500"
                                });
                            } else {
                                res.json({
                                    edit: true
                                });
                                console.log(req.user
                                    .first_name +
                                    " " + req.user
                                    .last_name +
                                    " edit a task -> " +
                                    req.body.data
                                    .name
                                );
                            }
                        });
                    } else {
                        res.json({
                            exists: false,
                            err: true,
                        });
                    }
                });
            } else if (req.body && req.body.type == "permissions") {

                res.json(permissions);
                // db.permissions.find().lean().exec(function(err,
                //     permissions) {
                //     res.json(permissions);
                // });
            } else {
                res.json({
                    err: "low args"
                });
            }
        } else if (_.includes(req.user._permissions, "see_all_users") ||
            _.includes(req.user._permissions, "add_many_user") ||
            _.includes(req.user._permissions, "request_generator")) {
            if (req.body && req.body.type == "list") {
                db.tasks.find({}, {
                        __v: false,
                        _creator: false
                    })
                    .sort({
                        _id: 1
                    })
                    .lean()
                    .exec(function(err, tasks) {
                        if (err) {
                            console.log(err);
                        } else if (tasks) {
                            res.json(tasks);
                        }
                    });
            }
        } else next();

    };

    return _return;
})();
