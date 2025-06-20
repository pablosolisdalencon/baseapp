const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
  {
    actionName: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
