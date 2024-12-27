const express = require("express");
const path = require('path');
const router = express.Router();
const multer = require('multer');
const ModelExercise = require("./../models/Exercise");
const CONFIG = require('./../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 *10
    } 
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    var upload = multer({ storage : storage}).any();
    upload(req,res,async function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        } else {
            const {type} = req.body;
            if (type == "exercise"){
                let exercise = await ModelExercise.findById({ _id: id})
                req.files.forEach( function(f) {
                 let formatted_folder = f.path.split(path.sep).join('/');
                 let _file = "/"+ formatted_folder;
                 if (f.fieldname == "image"){
                     exercise.image = _file;
                 }
                 if (f.fieldname == "cover"){
                     exercise.cover =  _file;
                 }
                 if (f.fieldname == "miniature"){
                     exercise.miniature =  _file;
                 }
                });
                await exercise.save();
            }
           res.end('Image uploaded successfully');
        }
    });    
});

router.post("/:id", upload.fields(
    [ 
        { name: "miniature", maxCount: 1 },
        { name: "cover", maxCount: 1 },
        { name: "image", maxCount: 1 }
    ]) ,  (req, res) => {

    if (req.files){
        res.json({message: 'Image uploaded successfully'});
    } else {
        res.status(400).json({ message: 'Error uploading image'});
    }
  }
);

module.exports = router;

