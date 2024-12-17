const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
const uniqueValidator = require('mongoose-unique-validator')

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String , require: true, unique: true},
    description:   String ,
    video:   String ,
    cover:   String ,
    miniature: String,
    groupmuscle: {
      type: String,
      ref: 'groupMuscle'
    },
    typeexercise: {
      type: String,
      ref: 'exerciseType'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

exerciseSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
  }
});
exerciseSchema.plugin(uniqueValidator);

const ModelExerciseType = mongoose.model("Exercise", exerciseSchema);
module.exports = ModelExerciseType;