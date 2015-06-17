
var db = require('mongo_schemas');
var sms = require('send_sms');
var _ = require('lodash');
var send_sms = require('send_sms_log');

module.exports = (function () {
    var _return = {};

    _return.get = function (req, res , next) {
        if(_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "sms_root")){
            var _r = {} ;
            db.send_sms_archive.count(function(err,c){
                _r["پیام های ارسال شده"] = c;
                _r["شماره پیامک"] = global.init.sms_sender ;
                db.sms_config.findOne().lean().exec(function(err,result){
                    if(result && result.credit)
                        _r["اعتبار باقی مانده"] = result.credit ;
                    res.json(_r);
                });
            });
        } else next();
    };

    _return.post = function (req, res ,next) {
        if(_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "sms_root")){
            console.open(req.body);
            var data = req.body ;
            if(data.text && data.contacts && (data.contacts.male || data.contacts.female)){
                var query = {} ;
                if(!(data.contacts.male && data.contacts.female)){
                    if(data.contacts.male){
                        query.gender = true
                    } else if(data.contacts.male){
                        query.gender = { $exists: false };
                    }
                }
                if(data.university) query.sadjad_uni_student = true ;
                if(data.active) query.active = true ;

                db.users.find(query).lean().exec(function(err,users){
                    if(err) console.log(err);
                    else if (users){
                        res.json({ send : false , count : users.length });
                        console.log(req.user.first_name + " " + req.user.last_name + "send custom SMS -> " + users.length );
                        console.log("text -> " + data.text);
                        users.forEach(function (user) {
                            send_sms({ text : data.text , to : String.dec_mobile(user.mobile)  },"sending");
                        });
                    }
                });

            } else res.json({ send : false , count : 0 });
        }
    };

    return _return;
})();
