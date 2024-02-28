const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelper');

const Campground= require('../models/campground');

if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
    //adds env variables to process.env
}

const dbUrl=process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/camp-planner';
mongoose.connect(dbUrl)
.then(()=>{
    console.log("MONGOOSE CONNECTION OPEN!!");
})
.catch(e=>{
    console.log("MONGOOSE CONNECTION ERROR");
    console.log(e);
})

//returns a random elemnt from the input array
const sample= array=> array[Math.floor(Math.random()*array.length)];

//seedDB clears existing daa and adds new ones
const seedDB =async ()=>{
    await Campground.deleteMany({});
    //deletes all campgrounds
    
    for(let i=0;i<200;i++){
        const random1000=Math.floor(Math.random()*(cities.length-1));
        const price=Math.floor(Math.random()*20)+10;

        const camp=new Campground({
            location:`${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author:"65dfbbf566e5c301b8e4d128",
            images:[
                {
                    url: 'https://res.cloudinary.com/dtyp1ijei/image/upload/v1708946244/CampPlanner/drwqvezkigoqqjownbx9.jpg',        
                    filename: 'CampPlanner/drwqvezkigoqqjownbx9'
                  },
                {
                  url: 'https://res.cloudinary.com/dtyp1ijei/image/upload/v1708946245/CampPlanner/e7awso4cowgo0nfzzcjz.jpg',        
                  filename: 'CampPlanner/e7awso4cowgo0nfzzcjz'
                }
              ],
              geometry:{
                type:'Point',
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
              },
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi neque placeat quaerat, atque dolorum ullam soluta beatae. Dolorum ex, nesciunt inventore, sequi odit recusandae, similique quibusdam laudantium quidem distinctio repellat",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});