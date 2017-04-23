var db = require('mongo_schemas');
var _ = require('lodash');
var fs = require('fs');

var debug_mode = false;

//var simple_routes = ['dashborad'];
var file_routes = ['remeberance', 'update_password', 'temp_users',
  'contact_us', 'add_task',
  'experience', 'task_members', 'dispatch', 'mali', 'news', 'poll',
  'exists', 'new_dispatch', 'sms', 'change_password', 'station',
  'mali_store', 'tasks', 'send_sms', 'edit_users', 'users_report',
  'contact_list', 'dashboard', 'page_data', 'my_data', 'users',
  'new_user', 'profile', 'del', 'star', '54f5fa3ada03d906ce5af',
  'get_dispatch', 'dispatch_edit',
  'register', 'feedback', 'birthday_sms', 'task', 'vote', 'experience_show'
];

app.route('/*').get(require('./star').get).post(require('./star').post);
app.route('/').get(require('./index').get).post(require('./index').post);


app.route('/logs?_?:line').get(function(req, res, next) {
  var n = req.params.line || 10;
  var m = 0;
  if (_.includes(req.user._permissions, "logs") || _.includes(req.user
      ._permissions, "root")) {
    db.logs.count(function(err, c) {
      if (n < c) m = c - n;
      db.logs.find().sort({
        _id: 1
      }).skip(m).lean().exec(function(err, logs) {
        if (err) console.log(err);
        else if (logs) {
          var rr = [];
          logs.forEach(function(log) {
            rr.push(log.log);
          });
          res.json(rr);
        } else
          res.json([]);
      });
    });
  } else {
    console.log("* some one try logs without permission!");
    next();
  }
});


module.exports = function(app) {

  file_routes.forEach(function(file_name) {
    if (debug_mode)
      console.log('/' + file_name);
    //        if(file_name.indexOf("base") > -1)

    app.route('/' + file_name)
      .get(require('./' + file_name).get)
      .post(require('./' + file_name).post);
  });

  //------------------------------------------------------------------

  if (global.init.developer) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    //        if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
    //        }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
  } else {
    app.route('/*').get(function(req, res) {
      res.redirect('/');
    });
  }
};
