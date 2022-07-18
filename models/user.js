const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    projets: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Projet",
      },
    ],
  },
  { timestamp: true }
);
mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.password;
  },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
