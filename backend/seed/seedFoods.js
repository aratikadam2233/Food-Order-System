// Run with: npm run seed
// Populates sample food items and a default admin + customer account.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Food = require('../models/Food');
const User = require('../models/User');

const sampleFoods = [
  {
    name: 'Margherita Pizza',
    description: 'Classic delight with 100% real mozzarella cheese and fresh basil.',
    category: 'Pizza',
    price: 249,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600',
    ingredients: ['Mozzarella Cheese', 'Tomato Sauce', 'Basil', 'Pizza Dough'],
    rating: 4.5,
    available: true,
  },
  {
    name: 'Cheese Burger',
    description: 'Juicy grilled patty topped with melted cheese, lettuce and tangy sauce.',
    category: 'Burger',
    price: 149,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    ingredients: ['Beef/Veg Patty', 'Cheese Slice', 'Lettuce', 'Burger Bun', 'Sauce'],
    rating: 4.3,
    available: true,
  },
  {
    name: 'Paneer Tikka',
    description: 'Chunks of paneer marinated in spiced yogurt and grilled to perfection.',
    category: 'Indian',
    price: 219,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
    ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers', 'Onions'],
    rating: 4.6,
    available: true,
  },
  {
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with mixed vegetables and aromatic spices.',
    category: 'Indian',
    price: 199,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600',
    ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
    rating: 4.4,
    available: true,
  },
  {
    name: 'Hakka Noodles',
    description: 'Stir-fried noodles tossed with fresh vegetables in a savory soy sauce.',
    category: 'Chinese',
    price: 179,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600',
    ingredients: ['Noodles', 'Cabbage', 'Carrot', 'Capsicum', 'Soy Sauce'],
    rating: 4.2,
    available: true,
  },
  {
    name: 'French Fries',
    description: 'Crispy golden fries served hot and salted, a perfect snack.',
    category: 'Snacks',
    price: 99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600',
    ingredients: ['Potatoes', 'Salt', 'Oil'],
    rating: 4.1,
    available: true,
  },
  {
    name: 'Chocolate Brownie',
    description: 'Rich, fudgy chocolate brownie served warm with a chocolate drizzle.',
    category: 'Desserts',
    price: 129,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
    ingredients: ['Chocolate', 'Flour', 'Butter', 'Sugar', 'Eggs'],
    rating: 4.7,
    available: true,
  },
  {
    name: 'Masala Chai',
    description: 'Traditional spiced tea brewed with milk, ginger and aromatic spices.',
    category: 'Beverages',
    price: 49,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600',
    ingredients: ['Tea Leaves', 'Milk', 'Ginger', 'Cardamom', 'Sugar'],
    rating: 4.5,
    available: true,
  },
  {
    name: 'Cold Coffee',
    description: 'Chilled creamy coffee blended with milk, ice and a touch of chocolate.',
    category: 'Beverages',
    price: 89,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
    ingredients: ['Coffee', 'Milk', 'Ice', 'Sugar'],
    rating: 4.3,
    available: true,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Food.deleteMany({});
    await Food.insertMany(sampleFoods);
    console.log(`Inserted ${sampleFoods.length} sample food items.`);

    const adminEmail = 'admin@foodorder.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'Admin@123',
        phone: '9999999999',
        role: 'admin',
      });
      console.log(`Created admin account -> email: ${adminEmail} | password: Admin@123`);
    } else {
      console.log('Admin account already exists, skipping creation.');
    }

    const customerEmail = 'customer@foodorder.com';
    const existingCustomer = await User.findOne({ email: customerEmail });
    if (!existingCustomer) {
      await User.create({
        name: 'Test Customer',
        email: customerEmail,
        password: 'Customer@123',
        phone: '8888888888',
        role: 'customer',
      });
      console.log(`Created test customer account -> email: ${customerEmail} | password: Customer@123`);
    } else {
      console.log('Test customer account already exists, skipping creation.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
