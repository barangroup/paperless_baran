// create date : 17/12/93

global.init = require('./config.json');
global.init.version = require('./package.json').version;
global.init.name = require('./package.json').name;

// downloaded modules
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var errorHandler = require('errorhandler');
var logger = require('morgan');
var session = require('cookie-session');
var compression = require('compression');
//var favicon = require('serve-favicon');


//------------------------------------------------------------------
// my own modules
require('./server/utils/requires');
//------------------------------------------------------------------
app = express();

// view engine setup
if (global.init.print_routes) {
  app.use(logger('dev'));
}
//app.use(favicon(__dirname + '/client/public/favicon.ico'));
//app.disable("x-powered-by");
app.use(compression());
app.use(cookieParser('dfinsfnstcoytounrgw'));
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'client/public')));

app.use(session({
  name: 'shroom',
  secret: 'kytddkhovoqyfjgfhch'
}));
//------------------------------------------------------------------
// app.use needs for posting data from forms to node
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//------------------------------------------------------------------
// add routes
require('./server/routes/_root')(app);
module.exports = app;
