var express = require('express');
var router = express.Router();
var users = require('./users');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/user/login', checkUserLoggedin,function(req, res) {
  res.render('login');
});
router.post('/token-check', getTokenFromHeader,users.user_edit);

router.get('/dashboard',checkUserSessionNull, function(req, res) {
  res.render('dashboard');
});
router.get('/user/detail/:id',sessionLoggedout,users.detail);
router.get('/logout',users.logout);
router.post('/user/form-submit',users.userdata);

function sessionLoggedout(req,res,next) {
  if(!req.session.loggedin){
      req.flash('sessionExpire', 'Session is expired');
      res.render('login',{error:req.flash('sessionExpire')});
  }
  next();
}
function checkUserLoggedin(req,res,next) {
  console.log(req.session.loggedin);
  if(req.session.loggedin == true){
      return res.redirect("/dashboard");
  }
  next();
}
function checkUserSessionNull(req,res,next) {
  if(!req.session.loggedin || req.session.loggedin == 'undefined'){
      return res.redirect("/user/login");
  }
  next();
}

function getTokenFromHeader(req,res,next) {
      var data = req.body;
      //console.log(req.headers['content-type']);
      if(req.headers['content-type'] != "application/json"){
        return res.json({"status":false,"message":"content type is not set"})
      }
     if(data.user_id == 1){
       return res.json({"status":false,"message":"You are not authenticate view this route"})
     }
      next();
}
module.exports = router;
