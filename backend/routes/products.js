const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const path = require('path');
const multer = require('multer');
const Product = require('../models/Product');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category || 'misc';
    const uploadPath = path.join(__dirname, '../public/uploads', category);
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image endpoint
router.post('/upload', [auth, admin, upload.single('image')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const category = req.body.category || 'misc';
    const imagePath = `/uploads/${category}/${req.file.filename}`;
    const fullImageUrl = `http://localhost:5000${imagePath}`;
    
    console.log('Image uploaded:', {
      filename: req.file.filename,
      path: imagePath,
      fullUrl: fullImageUrl,
      category: category
    });

    res.json({ 
      message: 'Image uploaded successfully',
      imagePath: imagePath,
      fullImageUrl: fullImageUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      message: 'Error uploading image', 
      error: error.message 
    });
  }
});

// Get all products, grouped by category
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    const grouped = { gowns: [], flowers: [], shoes: [], jewelry: [] };
    products.forEach(p => {
      if (grouped[p.category]) grouped[p.category].push(p);
    });
    res.json(grouped);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Add new product (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { category, product } = req.body;
    
    // Validate required fields
    if (!category || !product) {
      return res.status(400).json({ message: 'Category and product data are required' });
    }

    // Validate category
    const validCategories = ['gowns', 'flowers', 'shoes', 'jewelry'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate product data
    if (!product.name || !product.price || !product.description || !product.image) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    // Generate a unique id for the product
    const count = await Product.countDocuments({ category });
    const idPrefix = {
      'gowns': 'gown',
      'flowers': 'flower',
      'shoes': 'shoe',
      'jewelry': 'jewelry'
    }[category];
    const newId = `${idPrefix}-${count + 1}`;

    // Handle image path - ensure it's the full URL
    let imagePath = product.image;
    if (!imagePath.startsWith('http://localhost:5000')) {
      imagePath = `http://localhost:5000${imagePath}`;
    }

    // Create new product
    const newProduct = new Product({
      name: product.name,
      price: Number(product.price),
      description: product.description,
      image: imagePath,
      category: category,
      id: newId
    });

    // Save product
    const savedProduct = await newProduct.save();
    console.log('New product saved:', savedProduct); // Debug log

    res.status(201).json({ 
      message: 'Product added successfully', 
      product: savedProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      message: 'Error adding product', 
      error: error.message 
    });
  }
});

// Update product (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { category, product } = req.body;
    if (!category || !product) {
      return res.status(400).json({ message: 'Category and product data are required' });
    }
    let imagePath = product.image;
    if (imagePath && imagePath.startsWith('http://localhost:5000')) {
      imagePath = imagePath.replace('http://localhost:5000', '');
    }
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { ...product, category, image: imagePath },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    // Optionally, delete the image file from disk here if needed
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router; 