
var encrypt = require('encrypt');
var db = require('mongo_schemas');
var _ = require('lodash');

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
                res.json(user);
            }
        });
};

module.exports.post = function (req, res, next) {
    var user = {} ;
    user.data = req.body ;
    if(user && user.data){
        String.remove_empty_data(user.data);
        // console.open(req.body);

        db.users.findOne({ _id : req.session.q },function(err,u){

            u.telephone_number = user.data.telephone_number ;
            u.email = user.data.email ;
            u.city = user.data.city ;
            u.address = user.data.address ;


            if(user.data.mobile) {
                db.users.count({ mobile : String.enc_mobile(user.data.mobile) },function(err,c){
                    console.log(c);
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
                                    res.json({edit : false});
                                } else res.json( { edit : true } );
                            });
                        }

                    } else {
                        console.log("shit will happen -> my_data.js");
                    }
                });
            } else {
                if(user.data.password){
                        encrypt.hash(user.data.password,function(hash){
                            console.log("hash : " + hash);
                            u.password = hash ;
                            u.save(function(err){
                                if(err){
                                    console.log(err);
                                    res.json({edit : false});
                                } else res.json( { edit : true } );
                            });
                        });
                } else {
                    u.save(function(err){
                        if(err){
                            console.log(err);
                            res.json({edit : false});
                        } else res.json( { edit : true } );
                    });
                }
            }


        });
    }
};
