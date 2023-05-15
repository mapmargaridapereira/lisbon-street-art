const express = require('express');
const router = express.Router();

const Photo = require("../models/Photo.model");

const fileUploader = require("../config/cloudinary.config");

//Submit new photo to the DB
// GET route to display the form for submission
router.get('/photos/submit', (req,res)=>{
    res.render('pages/submit-photo.hbs');
});

// POST route to save a new photo to the database in the photos collection
router.post('/photos/submit', fileUploader.single("imageUrl"), (req,res)=>{

   const {title, author, description, location, imageUrl} = req.body;

   if (req.file) {
    imageUrl= req.file.path
   }

   async function submitPhotoToDb(){
    try{
        // Submiting the photo to DB
        let submittedPhoto = await Photo.create({title, author, description, location, imageUrl});
        //Checking if Photo was submitted
        console.log(`New photo submitted: ${submittedPhoto.title} `);
        res.redirect('/gallery');
    }
    catch(error){
        console.log(error);
    }
   }

   submitPhotoToDb();
});

// GET route to retrieve and display all the photos
router.get('/gallery', (req,res)=>{
    async function findAllPhotosFromDb(){
      try{
          // Find all the photos inside the collection 
          let allPhotosFromDb = await Photo.find();
  
         //Check if photos are being retrieved
        console.log('Retrieved photos from DB:', allPhotosFromDb);
  
        //Render the photos in the DB to view
          res.render('pages/gallery.hbs', {gallery: allPhotosFromDb});
      }
      catch(error){
          console.log(error);
      }
    }
    findAllPhotosFromDb();
});

module.exports = router;