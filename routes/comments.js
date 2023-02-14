var express = require("express");
var router = express.Router({mergeParams: true});
var Bachelor = require("../models/bachelor");
var Comment = require("../models/comment");
var middleware = require("../middleware"); 

//====================
//COMMENTS ROUTES
//====================

//Comment New
router.get("/new",middleware.isLoggedIn, function(req,res){
    //find the bachelor id 
    Bachelor.findById(req.params.id,function(err, bachelor){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{bachelor: bachelor});
        }
    })
});

//Comment create
router.post("/",middleware.isLoggedIn, function(req,res){
    //lookup bachelor using ID
    Bachelor.findById(req.params.id, function(err, bachelor){
        if(err){
            console.log(err);
            res.redirect("/bachelors");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","SOmething went wrong");
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    //save comment
                    comment.save();
                    bachelor.comments.push(comment);
                    bachelor.save();
                    console.log(comment);
                    req.flash("success","Successfully added the comment!! ")
                    res.redirect('/bachelors/' + bachelor._id);
                }
            })
            
        }
    })
    //create new comment
    //connnect new  comment to bahcelor
    //redirect bachelor show page

});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{bachelor_id: req.params.id, comment: foundComment});
        }
    });
});


//COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/bachelors/" + req.params.id );
        }
    });
});

//COMMENT DESTORY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Deleted!");
            res.redirect("/bachelors/" + req.params.id);
        }
    });
});





module.exports = router;