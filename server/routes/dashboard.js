module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    res.render('index');
  };

  _return.post = function(req, res) {
    console.log('/del');
    next();
  };

  return _return;
})();
