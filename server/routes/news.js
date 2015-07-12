var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        db.news.find({}, {
                _id: false
            }).limit(5)
            .populate({
                path: '_writer',
                select: 'first_name last_name -_id'
            })
            .lean()
            .exec(function(err, re) {
                res.json(String.remove_empty_data(re));
            });
    };


    _return.post = function(req, res, next) {

        var income_data = req.body.data;

        if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "news")) {
            if (req.body.type == "add" && income_data && income_data.text && income_data.title) {
                new db.news(income_data).save(function(err) {
                    if (err) {
                        console.log(err);
                        res.json({
                            add: false
                        });
                    } else {
                        res.json({
                            add: true
                        });
                    }
                });
            }
            res.json({
                err: "low args"
            });
        } else next();
    };

    return _return;
})();