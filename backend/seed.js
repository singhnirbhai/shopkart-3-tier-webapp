const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  {
    name: "iPhone 15 Pro Max",
    description: "Apple iPhone 15 Pro Max with A17 Pro chip, 256GB storage, titanium design, 48MP camera system with 5x optical zoom, USB-C, and all-day battery life.",
    price: 1199, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Apple", countInStock: 10, rating: 4.5, numReviews: 120
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, Galaxy AI features, and titanium frame.",
    price: 1299, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Samsung", countInStock: 15, rating: 4.3, numReviews: 89
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling wireless headphones with Auto NC Optimizer, crystal clear hands-free calling, and 30-hour battery.",
    price: 349, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Sony", countInStock: 25, rating: 4.7, numReviews: 234
  },
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "Apple MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, 1TB SSD, Liquid Retina XDR display.",
    price: 3499, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Apple", countInStock: 5, rating: 4.8, numReviews: 67
  },
  {
    name: "Nike Air Max 270",
    description: "The Nike Air Max 270 features Nike largest-ever Max Air unit in the heel for a super-soft ride that feels as impossible as it looks.",
    price: 150, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Fashion", brand: "Nike", countInStock: 50, rating: 4.2, numReviews: 345
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "The original blue jean since 1873. The 501 Original sits at the waist and is regular through the thigh with a straight leg.",
    price: 69, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    category: "Fashion", brand: "Levis", countInStock: 100, rating: 4.4, numReviews: 567
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "7-in-1 electric pressure cooker, slow cooker, rice cooker, steamer, saute pan, yogurt maker, and warmer. 6 Quart capacity.",
    price: 89, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    category: "Home & Kitchen", brand: "Instant Pot", countInStock: 30, rating: 4.6, numReviews: 890
  },
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Dyson most powerful cordless vacuum with laser dust detection, piezo sensor, and LCD screen showing real-time data.",
    price: 749, image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    category: "Home & Kitchen", brand: "Dyson", countInStock: 12, rating: 4.5, numReviews: 156
  },
  {
    name: "The Alchemist",
    description: "Paulo Coelho's masterwork tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of treasure.",
    price: 14, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    category: "Books", brand: "HarperOne", countInStock: 200, rating: 4.7, numReviews: 1234
  },
  {
    name: "PlayStation 5",
    description: "Sony PlayStation 5 console with ultra-high speed SSD, haptic feedback, adaptive triggers, and 3D Audio technology.",
    price: 499, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Sony", countInStock: 8, rating: 4.8, numReviews: 456
  },
  {
    name: "Kindle Paperwhite",
    description: "The thinnest, lightest Kindle Paperwhite yet with a 6.8-inch display, adjustable warm light, and up to 10 weeks of battery.",
    price: 139, image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Amazon", countInStock: 40, rating: 4.6, numReviews: 678
  },
  {
    name: "Adidas Ultraboost 23",
    description: "Experience incredible energy return with the Adidas Ultraboost. Features BOOST midsole and Continental rubber outsole.",
    price: 190, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    category: "Fashion", brand: "Adidas", countInStock: 35, rating: 4.3, numReviews: 234
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "KitchenAid Artisan Series 5-Quart Tilt-Head Stand Mixer with 10 speeds and planetary mixing action.",
    price: 379, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop",
    category: "Home & Kitchen", brand: "KitchenAid", countInStock: 20, rating: 4.8, numReviews: 432
  },
  {
    name: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones. No. 1 New York Times bestseller.",
    price: 16, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    category: "Books", brand: "Avery", countInStock: 150, rating: 4.8, numReviews: 2345
  },
  {
    name: "Ray-Ban Aviator Sunglasses",
    description: "Ray-Ban Aviator Classic sunglasses with gold frame and green G-15 lenses. Iconic since 1937.",
    price: 163, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    category: "Fashion", brand: "Ray-Ban", countInStock: 45, rating: 4.5, numReviews: 789
  },
  {
    name: "iPad Air M2",
    description: "Apple iPad Air with M2 chip, 11-inch Liquid Retina display, 128GB storage, Wi-Fi 6E, and all-day battery life.",
    price: 599, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    category: "Electronics", brand: "Apple", countInStock: 18, rating: 4.6, numReviews: 321
  }
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await User.create({ name: 'Admin', email: 'admin@test.com', password: 'admin123', isAdmin: true });
    await User.create({ name: 'John Doe', email: 'john@test.com', password: 'john123' });
    await Product.insertMany(products);
    console.log('✅ Database seeded!');
    console.log('👤 Admin: admin@test.com / admin123');
    console.log('👤 User:  john@test.com  / john123');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDB();
