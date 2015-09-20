var db = require('mongo_schemas'),
    enc = require('encrypt');

//var valid = require('validator');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        next();
    };

    _return.post = function(req, res) {
            var data = req.body;
            //        console.log(data);
            //-----------------------------------------------------------------------
            /*if(data["task"] == "login"){
                if(data.username && data.password){
                    db.mali_api.findOne(
                        { username : data.username },
                        { password : true ,_id : false }).lean().exec(function(err,user){
                            if(err) {
                                res.send("error");
                                console.log(err);
                            } else if (user) {
                                enc.compare(data.password ,user.password ,function(result){
                                    if(result) res.send("ok");
                                    else res.send("wrong password");
                                });
                            } else {
                                res.send("no user");
                            }
                        })
                } else res.json({ error : "low args" });
            }
            //-----------------------------------------------------------------------
            else*/
            if (data["task"] == "register" && data.mobile) {

                // todo : validate
                // console.log("mali_api -> try to register");
                // if(data.username && data.password){
                db.mali_api.findOne({
                        mobile: data.mobile
                    }, {
                        _id: true
                    })
                    .lean().exec(function(err, user) {
                        if (err) {
                            res.send("error");
                            console.log(err);
                        } else if (user) {
                            console.log("mali_api -> user exists");
                            res.send("exists");
                        } else {
                            db.mali_api.count(function(err, c) {
                                if (err) {
                                    res.send("error");
                                    console.log(err);
                                } else if (c < 500) { // limit size of registration on 500 !
                                    /*enc.hash(data.password,function(hash){
                                        data.password = hash ;
                                        new db.mali_api(data).save(function(err){
                                            if(err) {
                                                res.send("error");
                                                console.log('mali_api -> error in saving');
                                            }
                                            else res.send("ok");
                                            console.log('mali_api -> new user registered');
                                        });
                                    });*/
                                    new db.mali_api(data).save(function(err) {
                                        if (err) {
                                            res.send("error");
                                            console.log('mali_api -> error in saving');
                                        } else {
                                            res.send("ok");
                                            console.log('mali_api -> new mali user registered');
                                        }
                                    });
                                } else {
                                    res.send("error");
                                    console.log('mali_api -> custom db limit exceeded');
                                }
                            });
                        }
                    });
            } else res.json({
                error: 'low args'
            });
        }
        //-----------------------------------------------------------------------
        /*else if (data["task"] == "get_data") {
            if (data.username) {
                db.mali_api.findOne({
                        username: data.username
                    }, {
                        _id: false,
                        password: false,
                        __v: false`
                    })
                    .lean().exec(function(err, user) {
                        if (err) {
                            res.send("error");
                            console.log(err);
                        } else {
                            res.send(user.name + "|" + user.mobile);
                        }
                    });
            } else res.json({
                error: "low args"
            });
        }*/
        //-----------------------------------------------------------------------
        /*else if (data["task"] == "update") {
        if (data.username) {
            db.mali_api.findOne({
                username: data.username
            }, function(err, user) {
                if (data.name) user.name = data.name;
                if (data.family) user.family = data.family;
                if (data.age) user.age = data.age;
                if (data.address) user.address = data.address;
                if (data.university) user.university = data.university;
                if (data.mobile) user.mobile = data.mobile;
                if (data.work) user.work = data.work;
                if (data.email) user.email = data.email;
                if (data.status) user.status = data.status;
                if (data.password) {
                    enc.hash(data.password, function(hash) {
                        user.password = hash;
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                                res.send("error");
                            } else {
                                res.send("ok");
                                console.log('mali_api -> update a doc');
                            }
                        })
                    });
                } else {
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                            res.send("error");
                        } else {
                            res.send("ok");
                            console.log('mali_api -> update a doc');
                        }
                    })
                }
            });
        }
    } else res.json({
        error: "low args"
    });
};*/
    return _return;
})();