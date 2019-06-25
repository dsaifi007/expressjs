var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('req-flash');
var routes = require('./routes/index');
var csrf = require('csurf');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(csrf({ cookie: true }));
app.use(flash());

/* GET home page. */
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

// //view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ----------------------------------------------------------------------------------
app.get("/form",function(req, res) {
  res.render('login',{ csrftoken:req.csrfToken() } );
});
app.post('/form/form-submit' ,parseForm, csrfProtection, function(req, res) {
  res.send('Form is being processed');
});
// ----------------------------------------------------------------------------------

//app.set('views', path.join(__dirname, 'views'));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);
app.use(function(request,response,next){
    app.locals._token = request.csrfToken();
    next();
})

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err);
        /*res.render('error', {
            message: err.message,
            error: err
        });*/
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.error(err.stack);
    res.status(err.status || 500);
    res.send(err);
    /*res.render('error', {
        message: err.message,
        error: {}
    });*/
});


// error handler fir the CSRF token
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // Handle CSRF token errors here
  res.status(403);
  res.send('form tampered with');
});


app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'));
module.exports = app;
