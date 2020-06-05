var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine","ejs");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var methodOverride = require("method-override");
// mongoose.connect("mongodb://localhost:27017/v1",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false});
mongoose.connect("mongodb+srv://Arnav:Arnav2000@cluster0-0eldl.mongodb.net/gH?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false});
app.use(bodyParser.urlencoded({extended:true}));
var Game = require("./models/game");
var User = require("./models/user");
var Comment = require("./models/comment");
var commentRoutes = require("./routes/comment"),
    gamesRoutes = require("./routes/game"),
    indexRoutes = require("./routes/index");
app.use(flash());
app.use(require("express-session")({
    secret:"Oops",
    resave: false,
    saveUninitialized:false
}));
app.use('/css', express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.get("/",function(req,res){
    res.render("home");
})
app.use(indexRoutes);
app.use("/games",gamesRoutes);
app.use("/games/:id/comments",commentRoutes);

let port = process.env.PORT||3000;
app.listen(port);