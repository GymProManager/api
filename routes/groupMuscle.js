const express = require("express");
const router = express.Router();
const ModelGroupMuscle = require("./../models/Groupmuscle");

router.get("/", async (req, res) =>  {
  try {
    const List = await ModelGroupMuscle.find({});
    res.json(List);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

router.post("/", async (req, res) =>  {
    const body = req.body;
    const response = await ModelGroupMuscle.create(body)
    res.send(response);
  });

  
module.exports = router;