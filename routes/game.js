var express = require("express");
var router = express.Router();
var Game = require("../models/game");
var middleware = require("../middleware/index");
router.get("/",function(req,res){
    Game.find({},(function(err,games){
        if(err){
            console.log("error");
        }
        else{
            res.render("game",{data:games});
        }
    })
    )
});

router.post("/",middleware.isLoggedin,function(req,res){
    var name=req.body.name,
        image=req.body.image,
        genre=req.body.genre,
        category=req.body.category,
        desc=req.body.description
    var author = {
            id: req.user._id,
            username:req.user.username
        };
    var game = {name:name,image:image,genre:genre,description:desc,category:category,author:author}
    Game.create(game,function(err,newgame){
        if(err){
            console.log(err);
        }else{
            res.redirect("/games");
        }
    });
})
router.get("/new",function(req,res){
    res.render("new");
})
router.get("/:id",function(req,res){
    Game.findById(req.params.id).populate("comments").exec(function(err,fgame){
        if(err){
            console.log(err);
        }else{
            res.render("show",{game:fgame});
        }
    });
})

router.get("/:id/edit",middleware.checkGameOwnership,function(req,res){
    Game.findById(req.params.id,function(err,fgame){
        res.render("edit",{game:fgame});
    });
});
router.post("/:id",middleware.checkGameOwnership,function(req,res){
    Game.findByIdAndUpdate(req.params.id,req.body.game,function(err,ugame){
        if(err){
            console.log(err);
        }else{
            res.redirect("/games/"+req.params.id);
        }
    })
})
router.delete("/:id",middleware.checkGameOwnership,function(req,res){
    Game.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/games");
        }else{
            req.flash("success","Successfully deleted")
            res.redirect("/games");
        }
    })
})

module.exports = router;