const mongoose = require("mongoose");

const projetSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Projet", projetSchema);
