const mongoose=require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema=mongoose.Schema;
const Review=require('./review');

const CampgroundSchema= new Schema({
    title:String,
    price:Number,
    image:String,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    
    //one to many relationship
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

//mongoose middleware for cascade dlete of reviews
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({ _id: {$in :doc.reviews}});
    }
})

module.exports=new mongoose.model('Campground',CampgroundSchema);