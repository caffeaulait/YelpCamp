var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")

router.get("/",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds})
        }
    })
})

router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name:name,image:image,description:description,author:author}
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    })
})

router.get("/new",isLoggedIn,function(req, res) {
    res.render("campgrounds/new")
})


//shows more info about the campground
router.get("/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampGround){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show",{campground:foundCampGround})
        }
    })
})

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}



module.exports = router