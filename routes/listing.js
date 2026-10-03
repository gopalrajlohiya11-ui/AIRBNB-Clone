const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validationListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js");

const multer=require("multer");

const {storage}=require("../cloudConfig.js");
 
const upload=multer({storage});




router
    .route("/")
    //indexroute
    .get(wrapAsync(listingController.index))
    // create route
    .post(isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));

 


//new route
router.get("/new",isLoggedIn, listingController.renderNewforms);

router
    .route("/:id")
    //update route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validationListing,wrapAsync( listingController.updateListing))
    //delete route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))
    // show route
    .get( wrapAsync(listingController.showListing));







//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));





module.exports=router;


