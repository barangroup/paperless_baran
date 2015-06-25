
//var encrypt = require('encrypt');
var db = require('mongo_schemas');
var _ = require('lodash');

module.exports.get = function (req, res ,next) {
    next();
};

module.exports.post = function (req, res) {

    var task_title = " # " ;

    if(req.user){

        for( var i in req.user.task ){
            task_title +=  req.user.task[i].title + " # " ;
        }

        var a = {
            "page" : {
                "title" : "خانه"
            },
            "user" : {
                "first_name" : req.user.first_name ,
                "last_name" : req.user.last_name ,
                "group" : task_title,
                "gender" : typeof req.user.gender != "undefined" ? "male" : "female" ,
                "avatar" : "dist/img/avatar-male.jpg"
            },
            "menus" : [
                    {
                        "title" : "خانه",
                        "icon" : "fa-home",
                        "link" : "#/"
                    },

                ],
            "messages" : [],
            "version" : global.init.version
        };


        if(_.includes(req.user._permissions , "root") ||
            _.includes(req.user._permissions , "add_user")){
            a.menus.push({
                "title" : "افزودن کاربر",
                "icon" : "fa-plus-circle",
                "link" : "#/new-user"
            });
        }


        if(_.includes(req.user._permissions , "root") ||
            _.includes(req.user._permissions , "see_all_users") ||
            _.includes(req.user._permissions , "see_all_man_users") ||
            _.includes(req.user._permissions , "see_all_woman_users") ){
            a.menus.push({
                    "title" : "لیست اعضا",
                    "icon" : "fa-group",
                    "link" : "#/contact_list"
                });
        }
        if(_.includes(req.user._permissions , "root") ||
            _.includes(req.user._permissions , "logs")){
            a.menus.push({
                "title" : "لاگ سرور",
                "icon" : "fa-code",
                "label" : {
                    "text":"json",
                    "style" : "label-info"
                },
                "link" : "/logs_30"
            });
        }
        if(_.includes(req.user._permissions , "root") ||
            _.includes(req.user._permissions , "users_report")){
            a.menus.push({
                "title" : "آمار نیروی انسانی",
                "icon" : "fa-bar-chart-o",
                "label" : {
                    "text":"در حال تکمیل",
                    "style" : "label-warning"
                },
                "link" : "#/users-report"
            });
        }
        if(_.includes(req.user._permissions , "root") ||
            _.includes(req.user._permissions , "birthday_sms")){
            a.menus.push({
                "title" : "پیامک تولد",
                "icon" : "fa-birthday-cake",
                "link" : "#/birthday-sms"
            });
        }
        if(_.includes(req.user._permissions , "root") ||
            _.includes(req.user._permissions , "sms_root")){
            a.menus.push({
                "title" : "ارسال پیامک",
                "icon" : "fa-mobile",
                "link" : "#/send-sms"
            });
        }
        if(_.includes(req.user._permissions , "root")){
            a.menus.push({
                "title" : "ثبت مراکز",
                "icon" : "fa-building-o",
                "link" : "#/stations"
            });
        }

        if(_.includes(req.user._permissions , "root")){
            a.menus.push({
                "title" : "ثبت اعزام",
                "icon" : "fa-building-o",
                "link" : "#/submit-dispatch"
            });
        }
    }

    res.json(a);
};
