module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    res.render('contact_list');
  };

  _return.post = function(req, res) {
    next();
  };

  return _return;
})();
