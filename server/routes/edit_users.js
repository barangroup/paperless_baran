var date_convert = require('date');
//var encrypt = require('encrypt');
var db = require('mongo_schemas');
var _ = require('lodash');

module.exports.get = function(req, res, next) {
    next();
};

module.exports.post = function(req, res, next) {


    if (req.user && req.user._permissions && (_.includes(req.user._permissions, "root") ||
            _.includes(req.user._permissions, "edit_users"))) {
        var user = String.remove_empty_data(req.body);



        if (user._id) {
            // console.open(req.body);
            db.users.findOne({
                _id: user._id
            }, function(err, u) {
                if (err) console.log(err);
                else if (u) {
                    if (user.first_name) u.first_name = user.first_name;
                    if (user.last_name) u.last_name = user.last_name;
                    u.student_number = user.student_number;


                    if (user.birth_year && user.birth_month && user.birth_day) {
                        date_convert.to_miladi({
                            year: user.birth_year,
                            month: user.birth_month,
                            day: user.birth_day
                        }, function(date) {
                            u.birth_date = date;
                        });
                    }

                    u.entering_uni_year = user.entering_uni_year;


                    u.telephone_number = user.telephone_number;

                    if (user.gender) u.gender = true;
                    else if (u.gender) u.gender = undefined;

                    u.email = user.email;
                    // todo : free_times ?
                    u.major = user.major;
                    u.university = user.university;

                    u.address = user.address;

                    if (user.native) u.native = user.native;
                    else u.native = undefined;
                    if (user.have_job) u.have_job = user.have_job;
                    else u.have_job = undefined;

                    if (user.age_group_decide) u.age_group_decide = user.age_group_decide;
                    if (user.teaching_lessons) u.teaching_lessons = user.teaching_lessons;

                    if (user.task && (_.includes(req.user._permissions, "root"))) {
                        u.task = user.task;
                    } else if (_.includes(req.user._permissions, "root")) {
                        u.task = undefined;
                    }

                    u.skills = user.skills;

                    if (user.sadjad_uni_student) u.sadjad_uni_student = user.sadjad_uni_student;
                    else u.sadjad_uni_student = undefined;

                    if (user.city) u.city = user.city;

                    if (user._justified) u._justified = user._justified;
                    else u._justified = undefined;

                    if (user._visited) u._visited = user._visited;
                    else u._visited = undefined;

                    if (user._called) u._called = user._called;
                    else u._called = undefined;

                    if (user._under_attention) u._under_attention = user._under_attention;
                    else u._under_attention = undefined;

                    if (user._free_of_edu) u._free_of_edu = user._free_of_edu;
                    else u._free_of_edu = undefined;


                    if (user._active) u._active = user._active;
                    else u._active = undefined;

                    if (user._disabled) u._disabled = user._disabled;
                    else u._disabled = undefined;

                    if (user._comments) {
                        for (var i = 0; i < user._comments.length; i++) {
                            user._comments[i]._writer = req.user._id;
                        }
                        u._comments = u._comments.concat(user._comments);
                    }

                    if (user.mobile) {
                        db.users.findOne({
                            mobile: String.enc_mobile(user.mobile)
                        }, function(err, exist) {
                            // console.log(req.user.mobile);
                            if (err) console.log(err);
                            else if (exist && exist.mobile != u.mobile) {
                                res.json({
                                    exists: true
                                });
                            } else {
                                u.mobile = String.enc_mobile(user.mobile);
                                save(u, res, req);
                            }
                        });
                    } else {
                        save(u, res, req);
                    }

                }
            });
        } else {
            res.json({
                edit: false
            });
            console.log(req.user.first_name + " " + req.user.last_name + " " + "try to edit a user without _id parameter");
        }
    } else {
        next();
        if (req.user) console.log(req.user.first_name + " " + req.user.last_name + " " + "try to edit a user without having permission!!!");
        else console.log("someone try to edit a user without having permission!!!");
    }
};

function save(u, res, req) {
    // console.log("in save f");
    u.save(function(err, data) {
        if (err) console.log(err);
        else {
            console.log(req.user.first_name + " " + req.user.last_name + " " + "edit " + data.first_name + " " + data.last_name);
            res.json({
                edit: true
            });
        }
    });
}
