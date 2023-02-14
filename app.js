var express    = require("express"),
    app        = express(),
    cors       = require("cors"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Bachelor   = require("./models/bachelor"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
 
app.use(cors());
app.use(bodyParser.json());
//Requiring routes
var commentRoutes  = require("./routes/comments"),
    bachelorRoutes = require("./routes/bachelors"),
    indexRoutes    = require("./routes/index");

    
// seedDB(); //seed the database
mongoose.connect("mongodb+srv://vansh:vansh@cluster0.owpc6eh.mongodb.net/test/matri_monial");
mongoose.connection
    .once("open", () => console.log("Connected"))  //If connection is successful
    .on("eror", error => {                          //If any error occurs
        console.log("Your Error: ",error);
    });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I will make you proud oneday. ",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){           //This is the middleware for every single route
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/bachelors", bachelorRoutes);
app.use("/bachelors/:id/comments", commentRoutes);



app.listen(4000,function(){
    console.log("Matrimonial Server has started");
});