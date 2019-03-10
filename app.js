var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true})

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
})

var CampGround = mongoose.model("CampGround",campgroundSchema)

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
    
    
var campgrounds = [
        {name:"Salmon Creek", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c97ea4efb3b8_340.jpg"},
        {name:"Granite Hill", image:"https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
        {name:"Mountain Goat's Rest", image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},      
        {name:"Salmon Creek", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c97ea4efb3b8_340.jpg"},
        {name:"Granite Hill", image:"https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg"},
        {name:"Mountain Goat's Rest", image:"https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
        ]

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
    CampGround.find({},function(err,allcampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("index",{campgrounds:allcampgrounds})
        }
    })
})

app.post("/campgrounds",function(req,res){
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var newCampground = {name:name,image:image,description:description}
    CampGround.create(newCampground,function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    })
})

app.get("/campgrounds/new",function(req, res) {
    res.render("new")
})


//shows more info about the campground
app.get("/campgrounds/:id",function(req, res) {
    CampGround.findById(req.params.id,function(err,foundCampGround){
        if(err){
            console.log(err)
        }else{
            res.render("show",{campground:foundCampGround})
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started!")
})


 //cd ~/data
// rm mongod.lock
// cd ~
// ./mongod