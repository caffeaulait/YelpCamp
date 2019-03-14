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
var commentsRoutes = require("./routes/comments")
var campgroundRoutes = require("./routes/campgrounds")
var indexRoutes = require("./routes/index")
var methodOverride = require("method-override")


// seedDB()


mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true})


app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static(__dirname+"/public"))

app.use(methodOverride("_method"))

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

app.use("/",indexRoutes)
app.use("/campgrounds/:id/comments",commentsRoutes)
app.use("/campgrounds",campgroundRoutes)

//campgrounds


//comments routes


//auth routes- sign up

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started!")
})  




// cd ~/data
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
