const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const CampgroundSchema= new Schema({
    title:String,
    price:Number,
    image:String,
    description:String,
    location:String,
    
    //one to many relationship
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

module.exports=new mongoose.model('Campground',CampgroundSchema);