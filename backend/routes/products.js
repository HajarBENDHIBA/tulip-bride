const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category || 'misc';
    const uploadPath = path.join(__dirname, '../../frontend/public/uploads', category);
    fs.mkdir(uploadPath, { recursive: true }).then(() => {
      cb(null, uploadPath);
    }).catch(err => {
      cb(err);
    });
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
    
    res.json({ 
      message: 'Image uploaded successfully',
      imagePath: imagePath
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const productsPath = path.join(__dirname, '../../frontend/src/data/products.js');
    const fileContent = await fs.readFile(productsPath, 'utf8');
    // Extract the products object from the file content
    const productsMatch = fileContent.match(/export const products = ({[\s\S]*});/);
    if (!productsMatch) {
      throw new Error('Invalid products file format');
    }
    // Convert single quotes to double quotes and handle unquoted property names
    const jsonStr = productsMatch[1]
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/(\w+):/g, '"$1":');  // Quote property names
    const productsData = JSON.parse(jsonStr);
    res.json(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Add new product (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { category, product } = req.body;
    
    if (!category || !product) {
      return res.status(400).json({ message: 'Category and product data are required' });
    }

    const productsPath = path.join(__dirname, '../../frontend/src/data/products.js');
    const fileContent = await fs.readFile(productsPath, 'utf8');
    
    // Extract the products object from the file content
    const productsMatch = fileContent.match(/export const products = ({[\s\S]*});/);
    if (!productsMatch) {
      throw new Error('Invalid products file format');
    }
    // Convert single quotes to double quotes and handle unquoted property names
    const jsonStr = productsMatch[1]
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/(\w+):/g, '"$1":');  // Quote property names
    const productsData = JSON.parse(jsonStr);

    // Generate new ID
    const categoryProducts = productsData[category] || [];
    const lastId = categoryProducts.length > 0 
      ? parseInt(categoryProducts[categoryProducts.length - 1].id.split('-')[1])
      : 0;
    const newId = `${category}-${lastId + 1}`;

    // Add new product
    productsData[category] = [...categoryProducts, { ...product, id: newId }];

    // Write back to file with proper formatting
    const newContent = `export const products = ${JSON.stringify(productsData, null, 2)
      .replace(/"(\w+)":/g, '$1:')  // Remove quotes from property names
      .replace(/"/g, "'")};`;  // Replace double quotes with single quotes
    await fs.writeFile(productsPath, newContent);

    res.status(201).json({ message: 'Product added successfully', product: { ...product, id: newId } });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { id } = req.params;
    const { category, product } = req.body;

    if (!category || !product) {
      return res.status(400).json({ message: 'Category and product data are required' });
    }

    const productsPath = path.join(__dirname, '../../frontend/src/data/products.js');
    const fileContent = await fs.readFile(productsPath, 'utf8');
    
    // Extract the products object from the file content
    const productsMatch = fileContent.match(/export const products = ({[\s\S]*});/);
    if (!productsMatch) {
      throw new Error('Invalid products file format');
    }
    // Convert single quotes to double quotes and handle unquoted property names
    const jsonStr = productsMatch[1]
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/(\w+):/g, '"$1":');  // Quote property names
    const productsData = JSON.parse(jsonStr);

    // Find and update product
    const categoryProducts = productsData[category] || [];
    const productIndex = categoryProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    productsData[category][productIndex] = { ...product, id };

    // Write back to file with proper formatting
    const newContent = `export const products = ${JSON.stringify(productsData, null, 2)
      .replace(/"(\w+)":/g, '$1:')  // Remove quotes from property names
      .replace(/"/g, "'")};`;  // Replace double quotes with single quotes
    await fs.writeFile(productsPath, newContent);

    res.json({ message: 'Product updated successfully', product: { ...product, id } });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const productsPath = path.join(__dirname, '../../frontend/src/data/products.js');
    const fileContent = await fs.readFile(productsPath, 'utf8');
    
    // Extract the products object from the file content
    const productsMatch = fileContent.match(/export const products = ({[\s\S]*});/);
    if (!productsMatch) {
      throw new Error('Invalid products file format');
    }
    // Convert single quotes to double quotes and handle unquoted property names
    const jsonStr = productsMatch[1]
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/(\w+):/g, '"$1":');  // Quote property names
    const productsData = JSON.parse(jsonStr);

    // Find and remove product
    const categoryProducts = productsData[category] || [];
    const productIndex = categoryProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the product's image file if it exists
    const product = categoryProducts[productIndex];
    if (product.image && product.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../../frontend/public', product.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    productsData[category] = categoryProducts.filter(p => p.id !== id);

    // Write back to file with proper formatting
    const newContent = `export const products = ${JSON.stringify(productsData, null, 2)
      .replace(/"(\w+)":/g, '$1:')  // Remove quotes from property names
      .replace(/"/g, "'")};`;  // Replace double quotes with single quotes
    await fs.writeFile(productsPath, newContent);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router; 