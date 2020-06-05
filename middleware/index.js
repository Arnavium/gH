var Game = require("../models/game");
var Comment = require("../models/comment");
var middleObj = {};
middleObj.checkGameOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Game.findById(req.params.id,function(err,fgame){
            if(err){
            res.redirect("back");
            }else if(fgame.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error","Permission Denied!");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error","Please Login First!");
        res.redirect("back");
    }
}

middleObj.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","Please Login First!");
        res.redirect("/login")
    }
}

middleObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,fcomment){
            if(err){
                res.redirect("back");
            }else if(fcomment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error","Permission Denied!");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error","Please Login First!");
        res.redirect("back");
    }
}
module.exports = middleObj;