const mongoose= require('mongoose');
const { Schema, model } = mongoose;

const modelSchema = new Schema(
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
modelSchema.set('toJSON',{
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject._v;
  }
});

const Model = model("groupMuscle", modelSchema);
module.exports = Model;