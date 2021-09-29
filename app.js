var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var libraryRouter = require('./routes/library');
var addGameRouter = require('./routes/add');
var identifyRouter = require('./routes/identify');
var platformsRouter = require('./routes/platforms');
var amiiboRouter = require('./routes/amiibo');
var retailersRouter = require('./routes/retailers');
var wishlistRouter = require('./routes/wishlist');
var apiRouter = require('./routes/api');

var app = express();

var IGDBDriver = require('./models/IGDBDriver');
IGDBDriver.regenerateToken().catch(() => {
});

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
app.use('/amiibo', amiiboRouter);
app.use('/retailers', retailersRouter);
app.use('/wishlist', wishlistRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    res.render('404', {title: 'Pixel Shelf', type: 'page'});
});

// error handler
app.use(function (err, req, res, next) {// render the error page
    res.status(err.status || 500);
    res.render('error', {status: err.status || 500, message: err.message});
});

module.exports = app;
