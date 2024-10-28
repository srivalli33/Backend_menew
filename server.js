const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const multer = require('multer');
const EventEmitter = require('events');

EventEmitter.defaultMaxListeners = 20; // Adjust the number as needed
const app = express();
const PORT = process.env.PORT || 5000;
const myEmitter = new EventEmitter();
myEmitter.setMaxListeners(20);

// Middleware setup
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

console.log('MongoDB URI:', process.env.MONGO_URI);

// Define the menu item schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  bestSeller: { type: Boolean, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Store Base64 string or image URL
});

// MenuItem model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// API endpoint to add a menu item with image
app.post('/api/menuitems', async (req, res) => {
  const { name, price, category, bestSeller, description, image } = req.body;

  const newMenuItem = new MenuItem({
    name,
    price,
    category,
    bestSeller,
    description,
    image, // Save the Base64 string or image URL directly
  });

  try {
    const savedItem = await newMenuItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error adding menu item:', err);
    res.status(400).json({ message: 'Error adding menu item', error: err.message });
  }
});

// API endpoint to get all menu items
app.get('/api/menuitems', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
