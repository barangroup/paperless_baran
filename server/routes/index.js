var encrypt = require('encrypt');
var db = require('mongo_schemas');
//var _ = require('underscore');
//var request = require('request');


module.exports.get = function(req, res) {

  if (req.session.q) {
    res.redirect('/dashboard');
    //        res.redirect('/new_user'); // todo : this is a temp redirect and should remove
  } else {
    //        console.log("render index page");
    res.render('login');
  }
};

module.exports.post = function(req, res) {
  var user = req.body;
  //    console.open(user);

  // uncomment this comment to add recapcha ti site from server side and for client uncomment codes in /client/view/index.ejs
  //    var options = {
  //        url: 'https://www.google.com/recaptcha/api/siteverify',
  //        method: 'POST' ,
  //        form : {
  //            secret : global.init.google_secret ,
  //            response : user['g-recaptcha-response']
  //        }
  //    };

  //    request(options, function (error, response, body) {
  //        body = JSON.parse(body);
  //        if (!error && response.statusCode == 200 && body) {
  //            console.log(body.success);
  //            console.log("inn");
  //            if(body["success"] == true){
  //                console.log("in");
  if (user.username) {
    db.users.findOne({
        mobile: String.enc_mobile(String.remove_space(user.username))
      }, {},
      function(err, contact) {
        if (contact) {
          encrypt.compare(user.password, contact.password, function(ok) {
            if (ok) {
              console.log("auth user -> " + contact.first_name + " " + contact.last_name);
              req.session.q = String(contact._id);
              res.json({
                auth: true
              });
              db.users.update({
                _id: contact._id
              }, {
                $set: {
                  _site_log: new Date()
                }
              }, function(err) {
                if (err) console.log(err);
              });
            } else {
              console.log('try for auth -> ' + contact.first_name + " " + contact.last_name + " / {wrong password}");
              res.json({
                auth: false
              });
            }
          });
        } else {
          console.log('try for auth -> ' + user.username + " {wrong username}");
          res.redirect('/');
        }
      });
  }
  //            } else {
  //                console.log("recapcha not success");
  //                console.open(user);
  //                res.json({ auth : false });
  //            }
  //        } else {
  //            res.json({ auth : false });
  //            console.log("return not valid data from Google!");
  //            console.open(user);
  //        }
  //    });
};
