var express    = require("express");
var router     = express.Router({mergeParams: true});
var Gig        = require("../models/gig");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	Gig.findById(req.params.id, function(err, gig){
		if(err){
		console.log(err);
	} else {
		res.render("comments/new", {gig: gig});
		}
	});
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	Gig.findById(req.params.id, function(err, gig){
		if(err){
			console.log(err);
			res.redirect("/gigs");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flast("error","Error!")
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					gig.comments.push(comment);
					gig.save();
					req.flash("success", "Successfully added comment!");
					res.redirect("/gigs/" + gig._id);
				}
			});
		}
	});
});

//COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Gig.findById(req.params.id, function(err, foundGig){
		if(err || !foundGig) {
			req.flash("error", "Gig not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {gig_id: req.params.id, comment: foundComment});
		}
		});
	});
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/gigs/" + req.params.id);
		}
	});
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment removed!");
			res.redirect("/gigs/" + req.params.id);
		}
	});
});

module.exports = router;