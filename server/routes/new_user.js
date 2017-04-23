var db = require('mongo_schemas');
var valid = require('validator');
var date_convert = require('date');
var _ = require('lodash');

module.exports = (function() {
  var _return = {};

  _return.get = function(req, res) {
    res.render('add_contact');
  };

  _return.post = function(req, res) {

    for (var i in req.body) {
      if (req.body[i] == null || req.body[i] == false || req.body[i] == "" || _.isArray(req.body[i]) && req.body[i].length < 1) {
        delete req.body[i];
      }
    }


    if (req.user && req.user._permissions && (_.includes(req.user._permissions, "root") ||
        _.includes(req.user._permissions, "add_user"))) {
      var user = req.body;
      if (user.mobile) user.mobile = String.remove_space(user.mobile);
      if (user &&
        user.mobile &&
        user.first_name &&
        user.last_name &&
        valid.isNumeric(user.mobile) &&
        //                _.isNumber(user.entering_uni_year) && todo : validate entering_uni_year
        (user.mobile.length == 10 || user.mobile.length == 11)) {

        if (user._comments) {
          user._comments.forEach(function(comment) {
            comment._writer = req.session.q;
          });
        }

        // if(user.skills){
        //     var skills = [] ;
        //     user.skills.forEach(function(skill){
        //         if( skill.title && skill.title != ""){
        //             skills.push(skill.title);
        //         }
        //     });
        //     user.skills = skills ;
        // }


        db.users.findOne({
          mobile: String.enc_mobile(user.mobile)
        }, {
          _id: true
        }).lean().exec(function(err, u) {
          if (err) {
            console.log(err);
            res.json({
              add: false
            });
          } else if (u) {
            res.json({
              add: false,
              exists: true
            });
            console.log(req.user.first_name + " " + req.user.last_name +
              " try to add a new user -> " + user.first_name + " " + user.last_name + " but he/she exists is DB");
          } else {
            user._creator = req.user._id;
            user.mobile = String.enc_mobile(user.mobile);

            if (user.birth_year && user.birth_month && user.birth_day) {
              date_convert.to_miladi({
                year: user.birth_year,
                month: user.birth_month,
                day: user.birth_day
              }, function(date) {
                user.birth_date = date;
                new db.users(user).save(function(err) {
                  if (err) {
                    console.log(err);
                    res.json({
                      add: false
                    });
                  } else {
                    console.log(req.user.first_name + " " + req.user.last_name +
                      " add a new user -> " + user.first_name + " " + user.last_name);
                    res.json({
                      add: true
                    });
                  }
                });
              });
            } else {
              new db.users(user).save(function(err) {
                if (err) {
                  console.log(err);
                  res.json({
                    add: false
                  });
                } else {
                  console.log(req.user.first_name + " " + req.user.last_name +
                    " add a new user -> " + user.first_name + " " + user.last_name);
                  res.json({
                    add: true
                  });
                }
              });
            }
          }
        });
      } else {
        console.log(req.user.first_name + " " + req.user.last_name + " -> not valid data");
        res.json({
          valid: false
        });
      }
    } else {
      res.json({
        have_permission: false
      });
      console.log("someone try to add new user without login!!!");
    }
  };

  return _return;
})();
