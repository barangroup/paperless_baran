
var db = require('mongo_schemas');
var _ = require('lodash');

module.exports = (function () {
    var _return = {};

    _return.get = function (req, res ,next) {
        if(_.includes(req.user._permissions , "birthday_sms") || _.includes(req.user._permissions , "root")){
            db.birthday_sms.findOne({},{ text : true , enable : true , _id : false }).lean().exec(function(err,birthday_sms){
                if(err) console.log(err);
                else if(birthday_sms)
                    res.json(birthday_sms);
            });
        } else next();
    };

    _return.post = function (req, res ,next) {
        if(req.user && req.body && req.body.text && (_.includes(req.user._permissions , "birthday_sms") || _.includes(req.user._permissions , "root")) ){
            db.birthday_sms.findOne(function(err,birthday_sms){
                birthday_sms.text = req.body.text ;
                if(req.body.enable) birthday_sms.enable = true ;
                else birthday_sms.enable = undefined ;
                birthday_sms.save(function(err){
                    if(err) {
                        console.log(err);
                        res.json({ edit : false });
                    } else {
                        console.log(req.user.first_name + " " + req.user.last_name + " edit birthday_sms");
                        res.json({ edit : true });
                    }
                });
            });
        } else next();
    };

    return _return;
})();
