var db = require('mongo_schemas');
var enc = require('encrypt');


db.tasks.count(function(err, c) {
    if (c == 0) {
        var root = {
            title: "مدیر سیستم",
            name: "root",
            permissions: [
                "root",
                "define_task_child",
                "logs",
                "sms_root",
                "sms_to_child",
                "birthday_sms",
                "edit_users",
                "see_all_users",
                "see_all_man_users",
                "see_all_woman_users",
                "see_all_users_notification",
                "see_all_man_users_notification",
                "see_all_woman_users_notification",
                "users_report",
                "add_dispatch",
                "stations",
                "see_all_dispatch",
                "see_all_man_dispatch",
                "see_all_woman_dispatch",
                "dispatch_report",
                "see_all_dispatch_notification",
                "see_all_man_dispatch_notification",
                "see_all_woman_dispatch_notification",
                "mali_dispatch",
                "add_cost",
                "mali_api",
                "mali_report",
                "mali_store",
                "see_all_mali_notification"
            ]
        };

        new db.tasks(root).save(function(err, _root) {
            if (err) console.log(err);
            else if (_root) {
                init_users(_root._id);
                console.log("* init root task");
            }
        });
    }
});

function init_users(root_id) {
    db.users.count(function(err, c) {
        if (c == 0) {
            enc.hash("XXXXXXXXXX", function(hash) {
                new db.users({
                    mobile: String.enc_mobile("09366666666"),
                    password: hash,
                    first_name: "الیاس",
                    last_name: "قاسمی",
                    gender: true,
                    native: true,
                    have_job: true,
                    sadjad_uni_student: true,
                    _justified: true,
                    _visited: true,
                    _called: true,
                    _active: true,
                    task: [root_id]
                }).save(function(err) {
                    if (err) console.log(err);
                    else console.log("* init elyas user");
                });
            });

            enc.hash("XXXXXXXXXX", function(hash) {
                new db.users({
                    mobile: String.enc_mobile("09355555555"),
                    password: hash,
                    first_name: "مهران",
                    last_name: "ارجمند",
                    native: true,
                    gender: true,
                    have_job: true,
                    sadjad_uni_student: true,
                    _justified: true,
                    _visited: true,
                    _called: true,
                    _active: true,
                    task: [root_id]
                }).save(function(err) {
                    if (err) console.log(err);
                    else console.log("* init mehran user");
                });
            });
        }
    });
}


db.birthday_sms.count(function(err, c) {
    if (err) console.log(err);
    if (c == 0) {
        var t = "قطره قطره های باران جمع شدند و باریدن گرفتند..." + "\n" +
            "تولد هر قطره تولد مهری ست دوباره..." + "\n" +
            "لبخند بارانیت به زندگی دست های کوچکم رنگ دیگر داد.." + "\n" +
            "معلم مهر، فرشته ی عشق زادروزت مبارک!" + "\n" +
            "گروه دانشجویی باران";

        new db.birthday_sms({
            text: t,
            enable: true
        }).save(function(err) {
            if (!err) console.log("* init birthday_sms collection");
        });
    }
});