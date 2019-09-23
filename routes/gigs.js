var express    = require("express");
var router     = express.Router();
var Gig        = require("../models/gig");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//GIGS HOME
router.get("/", function(req, res){
    Gig.find({}, function(err, gigs){
        if(err){
            console.log(err);
        } else {
            res.render("gigs/index", {gigs:gigs});
        }
    });
});

//CREATE NEW GIG
router.post("/", middleware.isLoggedIn, function(req, res){
    var event = req.body.event;
	var price = req.body.price;
	var date = req.body.date;
	var venue = req.body.venue;
	var link = req.body.link;
    var image = req.body.image;
    var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
	  console.log(err);	
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newGig = {event: event, venue: venue, date: date, price: price, link: link, image: image, description:description, author:author, location: location, lat: lat, lng: lng};
    Gig.create(newGig, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/gigs");
        }
    });
});
});	

//SHOWS FORM TO CREATE NEW GIG
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("gigs/new");
});

//SHOWS MORE INFO ABOUT ONE GIG
router.get("/:id", function(req, res){
    Gig.findById(req.params.id).populate("comments").exec(function(err, foundGig){
        if(err || !foundGig){
            req.flash("error", "Gig not found!");
			res.redirect("back");
        } else {
            res.render("gigs/show", {gig: foundGig});
        }
    });
});

//EDIT GIG ROUTE
router.get("/:id/edit", middleware.checkGigOwnership, function(req, res){
		Gig.findById(req.params.id, function(err, foundGig){
			res.render("gigs/edit", {gig: foundGig}); 
	});
});

//UPDATE GIG ROUTE
router.put("/:id", middleware.checkGigOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.gig.lat = data[0].latitude;
    req.body.gig.lng = data[0].longitude;
    req.body.gig.location = data[0].formattedAddress;
		  
	Gig.findByIdAndUpdate(req.params.id, req.body.gig, function(err, updatedGig){
		if(err){
			res.redirect("/gigs");
		} else {
			req.flash("success", "Successfully Updated");
			res.redirect("/gigs/" + req.params.id);
		}
	});
});
});

//DESTROY GIG ROUTE
router.delete("/:id", middleware.checkGigOwnership, function(req, res){
	Gig.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/gigs");
		} else {
			res.redirect("/gigs");
		}
	});
});

module.exports = router;