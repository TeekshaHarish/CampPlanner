const express=require('express');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const path=require('path');
const ejsMate=require('ejs-mate');
const Campground= require('./models/campground');
const campground = require('./models/campground');

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

app.get('/',(req,res)=>{
    res.render('home');
})

//note of slash and save the appjs file before running

// app.get('/makecampground',async(req,res)=>{
//     const camp=new Campground({title:'My Backyard',description:'cheap camping!'});
//     await camp.save();
//     res.send(camp);
// })
app.get('/campgrounds', async(req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',async (req,res)=>{
    //parse req.body 
    // {"campground":{"title":"hvs","location":"sjs"}}

    const campground=await new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})



//new route before id
app.get('/campgrounds/:id', async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    console.log(campground);
    res.render('campgrounds/show',{campground});
})

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
})

//method override for put patch request
//method in qeury string _method
app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    // res.send("Hi");
    res.redirect('/campgrounds');
})


app.listen(3000,()=>{
    console.log("Serving on port 3000");
})