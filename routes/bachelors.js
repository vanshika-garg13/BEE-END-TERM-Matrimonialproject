var express = require("express");
var router = express.Router();
var Bachelor = require("../models/bachelor");
var middleware = require("../middleware");      //No need to write the index.js file(special name)

//INDEX- show all the bachelors
router.get("/",function(req, res){
    //Get all profiles from db
    Bachelor.find({},function(err, allBachelors){
        if(err){
            console.log(err);
        }else{
            res.render("bachelors/index",{bachelors: allBachelors, currentUser: req.user, page: "bachelors"});
        }
    });
});

//CREATE - add new bachelors to the db
router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to bachelors array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBachelor = {name: name, image: image,description: description,author: author}
    

    //Create a new profile and save it to DB
    Bachelor.create(newBachelor, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("/bachelors");
        }
    });
});

//NEW - show form to create a new bachelor-profile
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("bachelors/new");
});

//SHOW - shows more info about one bachelor
router.get("/:id",function(req ,res){
    //find the bachelor with provided id 
    Bachelor.findById(req.params.id).populate("comments").exec(function(err, foundBachelor){
        if(err){
            console.log(err);
        }else{
            console.log(foundBachelor);
            res.render("bachelors/show",{bachelor: foundBachelor});
        }
    });
});


//EDIT BACHELOR ROUTE 
router.get("/:id/edit",middleware.checkBachelorOwnership, function(req,res){
        Bachelor.findById(req.params.id,function(err, foundBachelor){
             res.render("bachelors/edit",{bachelor: foundBachelor});        
        });
});

//UPDATE BACHELOR ROUTE
router.put("/:id",middleware.checkBachelorOwnership,function(req,res){
    //find and update the correct bachelor 
    Bachelor.findByIdAndUpdate(req.params.id,req.body.bachelor,function(err, updatedBachelor){
        if(err){
            res.redirect("/bachelors");
        }else{
            res.redirect("/bachelors/" + req.params.id);
        }
    });
    //redirect somewhere(show page)
});

//DESTROY BACHELOR ROUTE 
router.delete("/:id",middleware.checkBachelorOwnership,function(req, res){
    Bachelor.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/bachelors");
        }else{
            res.redirect("/bachelors");
        }
    });
});




module.exports = router;
