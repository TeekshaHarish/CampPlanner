if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
    //adds env variables to process.env
}

const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const path=require('path');
const ejsMate=require('ejs-mate');
// const Joi=require('joi');
// const {campgroundSchema, reviewSchema}=require('./schemas.js')
// const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
// const Campground= require('./models/campground');
// const Review=require('./models/review');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user");

const campgroundRoutes=require("./routes/campground.js");
const reviewRoutes=require("./routes/reviews.js");
const userRoutes=require("./routes/users");
const mongoSanitize=require("express-mongo-sanitize");
const MongoStore = require('connect-mongo');

// 'mongodb://127.0.0.1:27017/camp-planner'
// process.env.MONGO_URL
const dbUrl=process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/camp-planner';
mongoose.connect(dbUrl)
.then(()=>{
    console.log("MONGOOSE CONNECTION OPEN!!");
})
.catch(e=>{
    console.log("MONGOOSE CONNECTION ERROR");
    console.log(e);
})

// const db=mongoose.connection;
const app=express();


//to use boilerplate template format
app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

//prevents Mongo Injection ,removes all $ : etc
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, //update after what time
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const secret =process.env.SECRET;
const sessionConfig={
    store,
    name:"session", //changing name from deafault connect.sid
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true, //for https requests only
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
    
}
app.use(session(sessionConfig))
//use session before routes to include session and cookies in all the routes

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash related after session
app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})


app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.render('home');
})

//note of slash and save the appjs file before running

// app.get('/makecampground',async(req,res)=>{
//     const camp=new Campground({title:'My Backyard',description:'cheap camping!'});
//     await camp.save();
//     res.send(camp);
// })



//a 404 route when no other route is matched
app.all('*',(req,res,next)=>{
    next(new ExpressError("Page not found",404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="Oh No!Something Went Wrong!";
    res.status(statusCode).render('error',{err});
    // res.send('Oh boy something went wrong');
})

app.listen(3000,()=>{
    console.log("Serving on port 3000");
})