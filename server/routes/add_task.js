var _ = require('lodash');
var db = require('mongo_schemas');

var task_lists = [
  "root", // admin part
  "define_task_child",
  "logs",
  "news",
  "sms_root", // sms part
  "sms_to_child",
  "birthday_sms",
  "add_user", // ensani part
  "edit_users",
  "see_all_man_users",
  "see_all_woman_users",
  "see_all_man_users_notification",
  "see_all_woman_users_notification",
  "see_man_names",
  "see_woman_names",
  "users_report",
  "add_dispatch", // amoozesh part
  "stations",
  "see_all_man_dispatch",
  "see_all_woman_dispatch",
  "dispatch_report",
  "see_all_man_dispatch_notification",
  "see_all_woman_dispatch_notification",
  "man_mali", // mali part
  "woman_mali",
  "add_cost", // add hazine
  "mali_api",
  "mali_report",
  "mali_store",
  "see_all_mali_notification"
];

module.exports = (function() {

  return {
    get: function(req, res, next) {
      if (_.includes(req.user._permissions, "root")) {
        if (req.query && req.query.type == "permissions") {
          res.json(task_lists);
        }
      } else {
        res.json({
          err: "permission denied"
        })
      }

    },
    post: function(req, res, next) {
      if (_.includes(req.user._permissions, "root")) {} else {
        res.json({
          err: "permission denied"
        })
      }
    }
  }
})();
