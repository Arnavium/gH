var express = require("express");
var router = express.Router({mergeParams:true});
var Comment = require("../models/comment");
var Game = require("../models/game");
var middleware = require("../middleware/index");
router.get("/new",middleware.isLoggedin,function(req,res){
    Game.findById(req.params.id,function(err,game){
        if(err){
            console.log(err);
        }else{
            res.render("newc",{game:game});
        }
    })
});
router.post("/",middleware.isLoggedin,function(req,res){
    Game.findById(req.params.id,function(err,game){
        if(err){
            req.flash("error","Something Went Wrong!");
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    game.comments.push(comment);
                    game.save();
                    req.flash("success","Successfully added comment!");
                    res.redirect("/games/"+game._id);
                }
            })
        }
    })
})
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,fcomment){
        if(err){
            res.redirect("back");
        }else{
            res.render("editc",{game_id : req.params.id,comment:fcomment});
        }
    });
});
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,fcomment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/games/"+req.params.id);
        }
    });
})
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Successfully deleted")
            res.redirect("/games/"+req.params.id);
        }
    })
})
module.exports=router;