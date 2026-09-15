const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Food name is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Pizza', 'Burger', 'Indian', 'Chinese', 'Snacks', 'Desserts', 'Beverages'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: { type: String, required: [true, 'Image URL is required'] },
    ingredients: [{ type: String, trim: true }],
    rating: { type: Number, min: 0, max: 5, default: 4 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

foodSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Food', foodSchema);
