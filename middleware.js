const ExpressError=require('./utils/ExpressError');
const Campground= require('./models/campground');
const {campgroundSchema,reviewSchema}=require('./schemas.js');
const Review = require('./models/review.js');
module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        //store requested URL for Return Back fuctionality
        req.session.returnTo=req.originalUrl;
        req.flash('error','you must be signed in!');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
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

module.exports.isAuthor= async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have persmiison to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor= async (req,res,next)=>{
    const {reviewId, id}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have persmiison to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    const result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(result.error,400);
    }else{
        next();
    }
}