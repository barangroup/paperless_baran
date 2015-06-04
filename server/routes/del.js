module.exports = (function () {
    var _return = {};

    _return.get = function (req, res) {

//        console.log('/del');
//        var s = req.contact ? req.contact.mobile : "not sign_in user(it's OK)!" ;
//        console.log('exit from site -> ' /*+ s*/ );
        req.session = null;
        res.redirect('/');
    };

    _return.post = function (req, res) {
        console.log('/del');
        next();
    };

    return _return;
})();