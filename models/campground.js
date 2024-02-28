const mongoose=require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema=mongoose.Schema;
const Review=require('./review');

const opts={toJSON:{virtuals:true}}
const CampgroundSchema= new Schema({
    title:String,
    price:Number,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
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
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}"> <h5>${this.title}</h5></a> 
    <p>${this.description.substring(0,25)}...</p>`;
});

//mongoose middleware for cascade dlete of reviews
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({ _id: {$in :doc.reviews}});
    }
})

module.exports=new mongoose.model('Campground',CampgroundSchema);