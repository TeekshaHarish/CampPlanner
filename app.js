const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const path=require('path');
const ejsMate=require('ejs-mate');
const Joi=require('joi');
const {campgroundSchema, reviewSchema}=require('./schemas.js')
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const Campground= require('./models/campground');
const Review=require('./models/review');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
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

const validateCampground=(req,res,next)=>{
    //middleware format req,res,next
    const result=campgroundSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(result.error,400);
        // return res.send("ERROR");
    }else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    const result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(result.error,400);
    }else{
        next();
    }
}
app.get('/',(req,res)=>{
    res.render('home');
})

//note of slash and save the appjs file before running

// app.get('/makecampground',async(req,res)=>{
//     const camp=new Campground({title:'My Backyard',description:'cheap camping!'});
//     await camp.save();
//     res.send(camp);
// })
app.get('/campgrounds', catchAsync(async(req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',validateCampground,catchAsync(async (req,res)=>{
    //parse req.body 
    // {"campground":{"title":"hvs","location":"sjs"}}
    const campground=await new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));



//new route before id
app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show',{campground});
}));

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))

//method override for put patch request
//method in qeury string _method
app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    // res.send("Hi");
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async(req,res)=>{
    const{id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

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