const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedding-dress-shop';

async function migrate() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const productsPath = path.join(__dirname, '../data/products.json');
  const raw = fs.readFileSync(productsPath, 'utf8');
  const data = JSON.parse(raw);

  let allProducts = [];
  Object.entries(data).forEach(([category, items]) => {
    items.forEach(item => {
      allProducts.push({
        ...item,
        category,
      });
    });
  });

  await Product.deleteMany({});
  await Product.insertMany(allProducts);

  console.log(`Migrated ${allProducts.length} products to MongoDB!`);
  mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});