const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  type: String,
  vehicle: String,
  vehicleNo: String,
  insuranceType: String,
  billbook1: String,
  billbook2: String,
  citizenship1: String,
  citizenship2: String,
});

module.exports = mongoose.model("services", ServiceSchema);
