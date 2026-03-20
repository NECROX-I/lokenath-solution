const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db');
const User = require('../models/User');
const Product = require('../models/Product');

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin — pass plain password, pre-save hook in User model will hash it
    await User.create({
      name: process.env.ADMIN_NAME || 'Loknath Admin',
      email: process.env.ADMIN_EMAIL || 'admin@loknathasolution.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create sample products
    const products = [
      // Stationery
      {
        name: 'Classmate Notebook 200 Pages',
        price: 85,
        category: 'stationery',
        description: 'High quality ruled notebook with 200 pages, perfect for school and office use. Durable cover with smooth writing pages.',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        featured: true
      },
      {
        name: 'Reynolds 045 Fine Carbure Pen (10 Pack)',
        price: 65,
        category: 'stationery',
        description: 'Pack of 10 smooth writing ball pens. Ideal for everyday writing tasks. Available in blue ink.',
        stock: 300,
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400',
        featured: true
      },
      {
        name: 'Camlin Geometry Box',
        price: 120,
        category: 'stationery',
        description: 'Complete geometry set with compass, ruler, set squares, protractor, and more. Perfect for students.',
        stock: 80,
        image: 'https://images.unsplash.com/photo-1619364726002-cb8b0d95eac0?w=400',
        featured: false
      },
      {
        name: 'Apsara Pencil Box (Pack of 10)',
        price: 45,
        category: 'stationery',
        description: 'Premium quality pencils with smooth graphite. HB grade, perfect for school and art work.',
        stock: 200,
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
        featured: false
      },
      {
        name: 'A4 Printer Paper Ream (500 sheets)',
        price: 280,
        category: 'stationery',
        description: '80 GSM premium quality A4 printing paper. Suitable for all types of printers. Bright white finish.',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400',
        featured: true
      },
      {
        name: 'Stapler with 1000 Pins',
        price: 150,
        category: 'stationery',
        description: 'Heavy duty stapler with 1000 staple pins included. Full strip capacity. Ergonomic design.',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400',
        featured: false
      },
      {
        name: 'Sticky Notes (5 Colors, 100 sheets each)',
        price: 95,
        category: 'stationery',
        description: 'Bright colored self-adhesive sticky notes. 5 vibrant colors, 100 sheets each. 3x3 inch size.',
        stock: 120,
        image: 'https://images.unsplash.com/photo-1608498283931-f721ef86b254?w=400',
        featured: false
      },
      {
        name: 'Drawing Book A3 (32 pages)',
        price: 75,
        category: 'stationery',
        description: 'Thick 160 GSM pages drawing book. Ideal for sketching, watercolors, and art projects.',
        stock: 90,
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
        featured: false
      },
      // Toys
      {
        name: 'Lego Classic Creative Bricks Set',
        price: 899,
        category: 'toys',
        description: 'Classic LEGO brick set with 484 pieces in 33 colors. Encourages creativity and imagination in children aged 4+.',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        featured: true
      },
      {
        name: 'Wooden Puzzle - Animals (24 Pieces)',
        price: 350,
        category: 'toys',
        description: 'Educational wooden jigsaw puzzle featuring colorful animals. Develops cognitive skills and hand-eye coordination. For ages 3+.',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
        featured: true
      },
      {
        name: 'Remote Control Car',
        price: 1299,
        category: 'toys',
        description: 'High-speed RC car with 4-wheel drive. Up to 25 km/h speed. 2.4GHz remote control, 30 min battery life. For ages 6+.',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400',
        featured: true
      },
      {
        name: 'Abacus Learning Toy',
        price: 299,
        category: 'toys',
        description: 'Colorful wooden abacus for early math learning. 100 beads in 10 rows. Helps children learn counting and basic arithmetic.',
        stock: 55,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        featured: false
      },
      {
        name: 'Crayons Set (48 Colors)',
        price: 199,
        category: 'toys',
        description: 'Vibrant 48-color crayon set for kids. Non-toxic, smooth color laydown. Perfect for young artists aged 3+.',
        stock: 80,
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
        featured: false
      },
      {
        name: 'Doctor Play Set',
        price: 449,
        category: 'toys',
        description: 'Complete pretend play doctor kit with stethoscope, thermometer, and more. 18 accessories. Encourages role-play and creativity.',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1576765608870-4c81ufcacpb7?w=400',
        featured: false
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin Email:', process.env.ADMIN_EMAIL || 'admin@loknathasolution.com');
    console.log('🔑 Admin Password:', process.env.ADMIN_PASSWORD || 'Admin@12345');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();