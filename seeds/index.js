const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelper');

const Campground= require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/camp-planner')
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
    
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;

        const camp=new Campground({
            location:`${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://images.unsplash.com/photo-1418985991508-e47386d96a71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY4NzM3NjY5OQ&ixlib=rb-4.0.3&q=80&w=1080',
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi neque placeat quaerat, atque dolorum ullam soluta beatae. Dolorum ex, nesciunt inventore, sequi odit recusandae, similique quibusdam laudantium quidem distinctio repellat",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});