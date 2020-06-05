var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/login",function(req,res){
    res.render("login");
})
router.post("/login",passport.authenticate("local",{
    successRedirect:"/games",
    failureRedirect: "/login",
    failureFlash:"Invaild username or password"
}),function(req,res){});

router.get("/register",function(req,res){
    res.render("register");
})
router.post("/register",function(req,res){
    User.register(new User({username:req.body.username}), req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Successfully registered!");
            res.redirect("/games");
        });
    });
});


router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","logged out!!");
    res.redirect("/games");
})
module.exports = router;