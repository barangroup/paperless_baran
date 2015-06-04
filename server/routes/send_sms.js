
var db = require('mongo_schemas');
var sms = require('send_sms');
var _ = require('lodash');


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
        next();
    };

    return _return;
})();
