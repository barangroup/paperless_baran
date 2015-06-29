var _ = require('lodash');

var db = require('mongo_schemas');

module.exports = (function () {
    var _return = {};

    _return.get = function (req, res ,next) {
        if(_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "sms_root")){
            db.income_sms_archive
            .find({},{ _id : false })
            .populate({
                path: '_writer',
                select: 'first_name last_name -_id'
            })
            .lean()
            .exec(function(err,re){
                res.json(String.remove_empty_data(re));
            });
        } else res.status(403).send("premission deny!");
    };


    _return.post = function (req, res ,next) {
        next();
    };

    return _return;
})();
