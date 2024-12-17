const express = require("express");
const router = express.Router();
const ModelexerciseType = require("./../models/Exercisetype");

router.get("/", async (req, res) =>  {
  try {
    const exerciseTypeList = await ModelexerciseType.find({}).populate("exercises", {
      id: 1,
      name: 1
    });
    res.json(exerciseTypeList);
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
});

router.post("/", async (req, res) =>  {
    const body = req.body;
    const response = await ModelexerciseType.create(body)
    res.send(response);
  });

  
module.exports = router;