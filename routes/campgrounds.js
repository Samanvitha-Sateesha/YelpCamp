var express = require("express");
var router  = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");  //automatically requires index.js
//INDEX ROUTE
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});
//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    var newCampground = {name:name,price:price, image:image, description:desc,author:author};
    // campgrounds.push(newCampground);
    // create a new campground and save it to db and redirect the page back to database
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
    
});
//SHOW ROUTE
router.get("/:id",function(req,res){
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            // show the template of the same
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });   
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(foundCampground.author.id.equals(req.user._id)){
            res.render("campgrounds/edit",{campground:foundCampground});
        } 
    });    
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
// DESTROY CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;