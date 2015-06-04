
var date_convert = require('date');
var encrypt = require('encrypt');
var db = require('mongo_schemas');
var _ = require('lodash');
// var date = require('date');

module.exports.get = function (req, res) {
    db.users.findOne(
        { _id : req.session.q },
        {
            __v : false ,
            _id : false ,
            password : false ,
            _justified : false ,
            _visited : false ,
            _called : false ,
            _under_attention : false ,
            _comments : false,
            _creator : false ,
            _task_history : false ,
            _site_log : false ,
            _active : false ,
            first_name : false ,
            last_name : false ,
            task : false ,
            gender : false ,
            _disabled : false
        })
        .populate({
            path: 'task',
            select: 'title -_id'
        })
        .lean()
        .exec(function(err,user){
            if(err) {
                console.log(err);
                res.json({});
            }
            else if (user){
                user.mobile = String.dec_mobile(user.mobile);
                String.remove_empty_data(user);
                if(user.birth_date){
                    Date.en_to_persion_date(user.birth_date,function(date){
                        user.birth_date = date.date ;
                    });
                }
                res.json(user);
            }
        });
};

module.exports.post = function (req, res, next) {
    var user = {} ;
    console.open(req.body);
    user.data = req.body ;
    if(user && user.data){
        String.remove_empty_data(user.data);

        db.users.findOne({ _id : req.session.q },function(err,u){


            if(user.data.birth_year && user.data.birth_month && user.data.birth_day ){
                date_convert.to_miladi({
                    year: user.data.birth_year,
                    month: user.data.birth_month,
                    day: user.data.birth_day
                }, function (date) {
                    u.birth_date = date ;
                });
            }

            u.telephone_number = user.data.telephone_number ;
            u.email = user.data.email ;
            u.city = user.data.city ;
            u.address = user.data.address ;
            if(user.data.student_number) u.student_number = user.data.student_number ;
            if(user.data.major) u.major = user.data.major ;
            if(user.data._free_of_edu) u._free_of_edu = true ;
            else u._free_of_edu = undefined ;

            if(user.data.sadjad_uni_student) u.sadjad_uni_student = true ;
            else u.sadjad_uni_student = undefined ;

            if(user.data.mobile) {
                db.users.count({ mobile : String.enc_mobile(user.data.mobile) },function(err,c){
                    // console.log(c);
                    if(c == 1 && req.user.mobile != String.enc_mobile(user.data.mobile)){
                        res.json({ exists : true , edit : false });
                    } else if ( c == 1 || c == 0) {
                        u.mobile = String.enc_mobile(user.data.mobile) ;

                        if(user.data.password){
                                encrypt.hash(user.data.password,function(hash){
                                    // console.log("hash : " + hash);
                                    u.password = hash ;
                                    u.save(function(err){
                                        if(err){
                                            console.log(err);
                                            res.json({edit : false});
                                        } else {
                                            res.json( { edit : true } );
                                            console.log(req.user.first_name + " " + req.user.last_name + " edit his/her profile");
                                        }
                                    });
                                });
                        } else {
                            u.save(function(err){
                                if(err){
                                    console.log(err);
                                    res.json( { edit : false } );
                                } else res.json( { edit : true } );
                            });
                        }

                    } else {
                        console.log("shit will happen -> my_data.js");
                    }
                });
            } else {
                res.json({ edit : false });
            } 
            // else {
            //     if(user.data.password){
            //             encrypt.hash(user.data.password,function(hash){
            //                 console.log("hash : " + hash);
            //                 u.password = hash ;
            //                 u.save(function(err){
            //                     if(err){
            //                         console.log(err);
            //                         res.json({edit : false});
            //                     } else res.json( { edit : true } );
            //                 });
            //             });
            //     } else {
            //         u.save(function(err){
            //             if(err){
            //                 console.log(err);
            //                 res.json({edit : false});
            //             } else res.json( { edit : true } );
            //         });
            //     }
            // }
        });
    }
};
