//var express = require('express');
var conn = require('./../connection/db_connection');
var md5 = require('md5');


function getUserData(req,res) {
  var data = req.body;
  var a = conn.query("SELECT email FROM users WHERE email= ? AND password= ? ",[data.email,md5(data.password)],function(err,row,data){
    if(err){
      res.json({"error":"query error"});
    }else{
      if(row.length>0){
          req.session.email =row[0].email;
          req.session.loggedin = true;
          //console.log(req.session.email);
          res.redirect('/dashboard');
      }else{
        req.flash('invalidcredential', 'Credential is not valid!');
        res.render('login',{error:req.flash('invalidcredential')});
      }
    }
  });
}
function logout(req,res) {
    req.session.destroy();
    res.redirect('/user/login');
}

function detail(req,res) {
  var id = req.params.id;
  //console.log(data);
  conn.query("SELECT id,email FROM users WHERE id = ?",[id],function(err,row,data){
    if(err){
      res.json({"error":"query error"});
    }else{
       //console.log(row[0].email);
       res.render('user_listing',{data:row});
    }
  });
}


function user_data(req,res) {
  var data = req.body;
  console.log(data);
}

function user_edit_submited(req,res) {
  var data = req.body;
  var id = req.params.id;
  console.log(id);
}
function basicAuthentication(req,res,next) {
  console.log(req.body);
}
module.exports.detail = detail;
module.exports.logout = logout;
module.exports.userdata = getUserData;
module.exports.user_edit = user_data;
module.exports.basicAuth = basicAuthentication;
module.exports.useredit = user_edit_submited;
