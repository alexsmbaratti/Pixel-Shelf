var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {spawn} = require('child_process');
const useEInk = require('./config.json')["e-ink"];
const eInkPath = require('./config.json')["e-ink-path"];

var indexRouter = require('./routes/index');
var libraryRouter = require('./routes/library');
var addGameRouter = require('./routes/add');
var identifyRouter = require('./routes/identify');
var platformsRouter = require('./routes/platforms');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/library', libraryRouter);
app.use('/add', addGameRouter);
app.use('/identify', identifyRouter);
app.use('/platforms', platformsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

if (useEInk) {
    console.log("Spawning E-Ink Driver...");
    const python = spawn('python3', [eInkPath]);
}

module.exports = app;
