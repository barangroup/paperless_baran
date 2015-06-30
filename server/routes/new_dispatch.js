var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        if (_.includes(req.user._permissions, "root") || _.includes(req.user._permissions, "as")) {
            db.stations
                .find({}, {
                    name: true
                })
                .lean()
                .exec(function(err, re) {
                    res.json({
                        staions: String.remove_empty_data(re)
                    });
                });
        } else res.status(403).send("premission deny!");
    };


    _return.post = function(req, res, next) {
        next();
    };

    return _return;
})();