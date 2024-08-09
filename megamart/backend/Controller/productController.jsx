const Product = require('../models/Product');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Cloudinary folder
    format: async (req, file) => 'png', // Image format
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

// Multer configuration for file uploads
const upload = multer({ storage });

// POST method to create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Check if there are uploaded images
    const images = req.files ? req.files.map(file => file.path) : [];

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images, // Cloudinary URLs
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET method to retrieve all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('ratings.user');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET method to retrieve a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('ratings.user');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  upload // Export the Multer upload middleware
};
