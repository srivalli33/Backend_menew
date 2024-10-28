const mongoose = require('mongoose');

// Define Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: '' },
  bestSeller: { type: Boolean, default: false },
  description: { type: String, default: '' },
  image: { type: String, default: '' } // Base64 or URL
});

// Export the MenuItems model for the "MenuItems" collection
module.exports = mongoose.model('MenuItems', menuItemSchema, 'MenuItems');
