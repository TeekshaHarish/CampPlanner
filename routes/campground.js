const express=require("express");
const router=express.Router();
const catchAsync=require('../utils/catchAsync');

const campgrounds=require("../controllers/campgrounds");
const { isLoggedIn,isAuthor,validateCampground } = require("../middleware");

//requie all app components and change their paths

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));


//new route before id
router.get('/new', isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor, validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))


//method override for put patch request
//method in qeury string _method

//export is necessary to use it in another file
module.exports=router;
