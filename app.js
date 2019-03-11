var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var seedDB = require("./seeds")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var User = require("./models/user")
// seedDB()


mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true})


app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(__dirname+"/public"))

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
    res.locals.currentUser = req.user
    next()
})


app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds})
        }
    })
})

app.post("/campgrounds",function(req,res){
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var newCampground = {name:name,image:image,description:description}
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    })
})

app.get("/campgrounds/new",function(req, res) {
    res.render("campgrounds/new")
})


//shows more info about the campground
app.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampGround){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/show",{campground:foundCampGround})
        }
    })
})

//comments routes
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new",{campground: campground})
        }
    })
})

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/'+campground._id)
                }
            })
        }
    })
})


//auth routes- sign up
app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds")
        })
    })
})


//sign in
app.get("/login",function(req, res) {
    res.render("login")
})

app.post("/login",passport.authenticate("local",
    {    
     successRedirect:"/campgrounds",
     failureRedirect:"/login"
    }),function(req, res) {
    
})

//log out
app.get("/logout",function(req, res) {
    req.logout()
    res.redirect("/campgrounds")
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started!")
})  




 //cd ~/data
// rm mongod.lock
// cd ~
// ./mongod


// CampGround.create(
//     {name:"Mountain Goat's Rest",
//     image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
//     description:"This is a beatiful creek, worth visiting."
//     },
//     function(err,campground){
//         if(err){
//             console.log(err)
//         }else{
//             console.log("Newly created campground")
//             console.log(campground)
//         }
//     })
    
    
// var campgrounds = [
//         {name:"Salmon Creek", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c97ea4efb3b8_340.jpg"},
//         {name:"Granite Hill", image:"https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
//         {name:"Mountain Goat's Rest", image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},      
//         {name:"Salmon Creek", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c97ea4efb3b8_340.jpg"},
//         {name:"Granite Hill", image:"https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
//         {name:"Mountain Goat's Rest", image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
//         ]
