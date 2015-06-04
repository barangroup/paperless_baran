
var db = require('mongo_schemas');
var _ = require('lodash');
var fs = require('fs');

var debug_mode = false;

//var simple_routes = ['dashborad'];
var file_routes = [ 'send_sms' , 'edit_users' , 'users_report' , 'contact_list' , 'dashboard' , 'page_data' , 'my_data' , 'users' , 'new_user', 'profile', 'del' , 'star' ,'54f5fa3ada03d906ce5af' ,'register','feedback' , 'birthday_sms'];

app.route('/*').get(require('./star').get).post(require('./star').post);
app.route('/').get(require('./index').get).post(require('./index').post);

//app.route('/file_logs_?:line').get(function(req,res){
//    var n = req.params.line ;
//    if(_.includes(req._permissions ,"main_admin")) {
//        fs.readFile('server/logs', 'utf8' , function(err,result){
//            if(result){
//                var _res = [] ;
//
//                var lines = result.split('\n');
//                if( n > lines.length ){
//                    for(var i = 0 ; i < lines.length - 1 ; i++){
//                        _res.push( i + " -> " + lines[i]);
//                    }
//                    res.json(_res);
//                }
//                else {
//                    var len = lines.length - n - 1 ;
//                    for(var i = len ; i < lines.length - 1 ; i++){
//                        _res.push( i + " -> " + lines[i]);
//                    }
//                    res.json(_res);
//                }
//            } else {
//                res.json([]);
//            }
//        });
////    } else {
////        res.send([]);
////    }
//});

app.route('/logs?_?:line' ).get(function(req,res ,next){
    var n = req.params.line || 10 ;
    var m = 0 ;
    if(_.includes(req.user._permissions,"logs") || _.includes(req.user._permissions,"root") ){
        db.logs.count(function(err,c){
            if(n < c) m = c - n ;
            db.logs.find().sort( { _id : 1 }).skip(m).lean().exec(function(err ,logs){
                if(err) console.log(err);
                else if (logs){
                    var rr = [] ;
                    logs.forEach(function(log){
                        rr.push(log.log);
                    });
                    res.json(rr);
                }
                else
                    res.json([]);
            });
        });
    } else next();
});


module.exports = function (app) {

    file_routes.forEach(function (file_name) {
        if (debug_mode)
            console.log('/' + file_name);
//        if(file_name.indexOf("base") > -1)

        app.route('/' + file_name)
            .get(require('./' + file_name).get)
            .post(require('./' + file_name).post);
    });

//    fs.readdir( __dirname , function(err, files) { // todo : :(
//        if (err) console.log(err);
//        else {
//            files.forEach(function(file) {
//                if(file.substring(0,1) != "_" &&
//                    file.substring(file.length-2 ,file.length-1) != "~" &&
//                    file != "index.js"){
//                    var file_name = file.substring(0,file.length-3) ;
//                    console.log(file_name);
//                    app.route('/' + file_name)
//                        .get(require('./' + file_name).get)
//                        .post(require('./' + file_name).post);
//                }
//            });
//        }
//    });

//------------------------------------------------------------------

    if(global.init.developer){
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
//        if (app.get('env') === 'development') {
            app.use(function (err, req, res) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
//        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
    else {
        app.route('/*').get(function (req, res) {
            res.redirect('/');
        });
    }
};
