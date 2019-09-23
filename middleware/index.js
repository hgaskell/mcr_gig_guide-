var Gig           = require("../models/gig");
var Comment       = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkGigOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Gig.findById(req.params.id, function(err, foundGig){
		if(err || !foundGig){
			req.flash("error", "Gig not found!");
			res.redirect("back");
		} else {
		 if(foundGig.author.id.equals(req.user._id)){
			next();
		 } else {
			 req.flash("error", "You don't have permission to do that!");
			 res.redirect("back");
		 }
		}
	});
	} else {
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			req.flash("error", "Comment not found!");
			res.redirect("back");
		} else {
		 if(foundComment.author.id.equals(req.user._id)){
			next();
		 } else {
			 req.flash("error", "You don't have permission to do that!");
			 res.redirect("back");
		 }
		}
	});
	} else {
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in!");
	res.redirect("/login");
};

module.exports = middlewareObj;