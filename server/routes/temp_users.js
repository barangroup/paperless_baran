var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res) {
        res.render('temp_user');
    };

    _return.post = function(req, res) {
        new db.temp_users(req.body).save(function(err) {
            if (err) {
                res.json({
                    err: err
                });
            } else {
                res.redirect('/temp_user');
                console.log( req.user.first_name + " " + req.user.last_name + " add new temp user!");
            }
        });
    };

    return _return;
})();