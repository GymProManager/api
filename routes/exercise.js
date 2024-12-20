const express = require("express");
const router = express.Router();
const ModelExercise = require("./../models/Exercise");
const ModelExerciseType = require("./../models/Exercisetype");
const ModelGroupMuscle = require("./../models/Groupmuscle");

const mongoose = require("mongoose");
const { reset } = require("nodemon");
const swaggerJSDoc = require("swagger-jsdoc");
const { Schema, model, } = mongoose;

router.get("/", async (req, res) =>  {
  try {
    const modelList = await ModelExercise.find({}).populate("typeexercise groupmuscle", ["name"]);
    res.json(modelList);
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
});

router.get("/:id", async (req, res) =>  {
  const { id } = req.params;
  try {
    const modelList = await ModelExercise.find({ _id: id}).populate("typeexercise groupmuscle", ["name"], );
    res.json(modelList);
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
});

router.post("/", async (req, res) =>  {
  const { name, groupmuscle : groupmuscleId, typeexercise: typeexerciseId} = req.body;
  if (!name) {
    return res.status(400).json({
      error : 'Required "Name" field is missing'
    })
  }
  const exercise = await ModelExercise.find({ name: name});
  if (exercise && exercise.length > 0) {
    return res.status(400).json({
      error : 'Ejercicio ya registrado.'
    })
  }

  const exerciseType = await ModelExerciseType.findById(typeexerciseId);
  if (!exerciseType) {
    return res.status(400).json({
      error : '"exerciseType" not registred.'
    })
  }    
  const groupMuscle = await ModelGroupMuscle.findById(groupmuscleId);
  if (!groupMuscle) {
    return res.status(400).json({
      error : '"groupMuscleId" not registred.'
    })
  }
  const newExercise = new ModelExercise({
    name : name,
    typeexercise : groupmuscleId,
    groupmuscle : typeexerciseId
  })
  const saveExercise = await newExercise.save();

  if (exerciseType.exercises){
    exerciseType.exercises = exerciseType.exercises.concat(saveExercise._id);
    await exerciseType.save();
  }
  if (groupMuscle.exercises){
    groupMuscle.exercises = groupMuscle.exercises.concat(saveExercise._id);
    await groupMuscle.save();
  } 

  res.status(200).json(saveExercise);
});

router.put("/:id", async (req, res) => {
const { id } = req.params;
const { name, video, typeexercise, groupmuscle, description } = req.body;

let exercise = await ModelExercise.findById({ _id: id})
if (!exercise) {
  return res.status(404).json({ msg: "Entrenamiento no encontrado" });
}
const _typeexercise = exercise.typeexercise;
const _groupmuscle = exercise.groupmuscle;

exercise.name = name;
exercise.description = description;
exercise.typeexercise = typeexercise;
exercise.groupmuscle = groupmuscle;
exercise.video = video;
await exercise.save();

const exerciseType = await ModelExerciseType.findById(_typeexercise);    
exerciseType.exercises = exerciseType.exercises.filter(item => item != _typeexercise);
exerciseType.exercises = exerciseType.exercises.concat(typeexercise);
await exerciseType.save();

const groupMuscle = await ModelGroupMuscle.findById(_groupmuscle);
groupMuscle.exercises = groupMuscle.exercises.filter(item => item != _groupmuscle);
groupMuscle.exercises = groupMuscle.exercises.concat(groupmuscle);
await groupMuscle.save();

res.status(200).json(exercise);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  const exercise = await ModelExercise.findById(id)
  const _typeExercise = exercise.typeexercise;
  const _groupMuscle = exercise.groupmuscle;


  await ModelExercise.deleteOne({ _id: id });

  /*
  const exerciseType = await ModelExerciseType.findById(_typeExercise);    
  exerciseType.exercises = exerciseType.exercises.filter(item => item != exercise.typeExercise);
  await exerciseType.save();

  const groupMuscle = await ModelGroupMuscle.findById(_groupMuscle);    
  groupMuscle.exercises = groupMuscle.exercises.filter(item => item != exercise.groupMuscle);
  await groupMuscle.save();
*/
  res.status(204).end()
});


router.post("/import", async (req, res) =>  {
  for (const [key, value] of Object.entries(req.body)) {
    if (typeof(value) === 'string')
        req.body[key] = value.trim();
  }  
  const { name, groupmuscle , typeexercise, video, miniature, image, cover} = req.body;

  if (!name) {
    return res.status(400).json({
      error : 'Required "Name" field is missing'
    })
  }
  const exercise = await ModelExercise.find({ name: name});

  if (exercise  && exercise.length > 0) {
    return res.status(400).json({
      error : 'Ejercicio ya registrado.'
    })
  }
  const exerciseType = await ModelExerciseType.find({name: typeexercise});
  if (exerciseType == null ) {
    return res.status(400).json({
      error : `Tipo de ejercicio  ${typeexercise} no registrado.`
    })
  }    
  const groupMuscle = await ModelGroupMuscle.find({name: groupmuscle});
  if (groupMuscle == null ) {
    return res.status(400).json({
      error : `Grupo muscular ${groupmuscle} no registrado.`
    })
  }
  const urlImages = "/uploads/images/";
  const newExercise = new ModelExercise({
    name : name,
    typeexercise : (exerciseType[0] && exerciseType[0]._id) || '',
    groupmuscle : (groupMuscle[0] && groupMuscle[0]._id) || '',
    video : video || '',
    miniature : miniature && ( urlImages + miniature) || '',
    image : image && ( urlImages + image) || '',
    cover : cover && ( urlImages + cover) || ''      
  })
  const saveExercise = await newExercise.save();

  if (exerciseType.exercises){
    exerciseType.exercises = exerciseType.exercises.concat(saveExercise._id);
    await exerciseType.save();
  }
  if (groupMuscle.exercises){
    groupMuscle.exercises = groupMuscle.exercises.concat(saveExercise._id);
    await groupMuscle.save();
  } 
  res.status(200).json(saveExercise);
});

module.exports = router;


