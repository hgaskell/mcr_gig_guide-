require('dotenv').config();

var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
	flash         = require("connect-flash"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride= require("method-override"),
    Gig           = require("./models/gig"),
	Comment       = require("./models/comment"),
	User          = require("./models/user");

//REQUIRE ROUTES
var commentRoutes = require("./routes/comments"),
	gigRoutes     = require("./routes/gigs"),
	indexRoutes   = require("./routes/index");

//MONGOOSE CONNECTION
mongoose.connect("mongodb+srv://hgaskell:C1ty0142.@cluster0-nmbe7.mongodb.net/test?retryWrites=true", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Merlin",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/gigs", gigRoutes);
app.use("/gigs/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started");
});