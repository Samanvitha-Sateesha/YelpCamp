var express       = require("express"),
    bodyParser    = require("body-parser"),
    app           = express(),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash");
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
  
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes       = require("./routes/index");

// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"   
// mongoose.connect(url);     //as a backup in case if something goes wr
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false });    
// mongoose.connect("mongodb+srv://SamanvithaS:Sammy%40100500@cluster0-5o7au.mongodb.net/yelpcamp?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false });    

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(flash());
// seedDB();  // seed the database
app.use(methodOverride("_method"));
// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "I'm the best!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,function(){
    console.log("Yelpcamp server has started!");
});