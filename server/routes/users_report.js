var db = require('mongo_schemas');
var _ = require('lodash');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {

    if (_.includes(req.user._permissions, "users_report") ||
      _.includes(req.user._permissions, "root")) {
      var r = {};

      // callback HELL :|
      // any idea to solve it?

      db.users.count({}, function(err, all_users) {
        r.all_users = all_users;
        db.users.count({
          gender: {
            $exists: true
          }
        }, function(err, male_users) {
          r.male_users = male_users;
          r.female_users = all_users - male_users;
          db.users.count({
            native: true
          }, function(err, native) {
            r.native_users = native;
            db.users.count({
              free_of_edu: true
            }, function(err, free_of_edu) {
              r.free_of_edu = free_of_edu;
              db.users.count({
                sadjad_uni_student: true
              }, function(err, sadjad_uni_student) {
                r.sadjad_uni_student = sadjad_uni_student;
                db.users.count({
                  _active: true
                }, function(err, _active) {
                  r.active = _active;
                  db.users.count({
                    _visited: true
                  }, function(err, _visited) {
                    r.visited = _visited;
                    r.not_visited = all_users - _visited;
                    var temp = {};
                    db.users.distinct('entering_uni_year').sort().exec(function(err, years) {
                      String.sync_for(years.length, function(loop) {
                        db.users.count({
                          entering_uni_year: years[loop.iteration()]
                        }, function(err, rr) {
                          db.users.count({
                            entering_uni_year: years[loop.iteration()],
                            gender: {
                              $exists: true
                            }
                          }, function(err, rrr) {
                            db.users.count({
                              entering_uni_year: years[loop.iteration()],
                              _active: {
                                $exists: true
                              }
                            }, function(err, _active_by_year) {
                              temp[years[loop.iteration()]] = {
                                male: rrr,
                                female: rr - rrr,
                                all_active: _active_by_year
                              };
                              loop.next();
                            });
                          });
                        });
                      }, function() {
                        res.json(r);
                      });
                    });
                    r.report_by_year = temp;
                  });
                });
              });
            });
          });
        });
      });
    }
  };

  _return.post = function(req, res, next) {
    next();
  };

  return _return;
})();
