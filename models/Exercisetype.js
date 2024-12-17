const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const exerciseTypeSchema = new Schema(
  {
    name: { type: String },
    exercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise'
    }]
  },
  {
    timestamps: true,
    versionKey: false
  }
)
exerciseTypeSchema.set('toJSON',{
  virtuals: true ,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
  }
});

const ModelExerciseType =  mongoose.models.exerciseType || model("exerciseType", exerciseTypeSchema);
module.exports = ModelExerciseType;