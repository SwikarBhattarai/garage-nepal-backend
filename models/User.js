const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  photo: Array,
  hash: String,
  location: String,
  phonenumber: String,
  service: [
    {
      service: { type: Schema.Types.ObjectId, ref: "services" },
      active: Boolean,
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
