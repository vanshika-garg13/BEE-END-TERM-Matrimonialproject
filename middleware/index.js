var Bachelor = require("../models/bachelor");
var Comment  = require("../models/comment");
//all the middleware goes here 
var middlewareObj = {};

middlewareObj.checkBachelorOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Bachelor.findById(req.params.id,function(err, foundBachelor){
            if(err){
                req.flash("error","Bachelor not found!");
                res.redirect("/back");
            }else{
                //does user own the campground?
                if(foundBachelor.author.id.equals(req.user._id)){  //One is string and the other one is object
                    next();
                }else{
                    req.flash("error","You don't have permission to do that !");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that! ")
        res.redirect("back");
    }

}


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment){
            if(err){
                req.flash("error","Bachelor not found");
                res.redirect("/back");
            }else{
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){  //One is string and the other one is object
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
    
}

module.exports = middlewareObj;