const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// The URI from .env.local
const MONGODB_URI_LOCAL = process.env.MONGODB_URI;

async function checkLocalEnvData() {
    console.log('Connecting to [youranimehub] database...');
    try {
        const conn = await mongoose.connect(MONGODB_URI_LOCAL);
        console.log('✅ Connected');

        // Check Products
        const productsCount = await conn.connection.db.collection('products').countDocuments();
        console.log(`\n[youranimehub] Products Count: ${productsCount}`);

        // Check Categories
        const categoriesCount = await conn.connection.db.collection('categories').countDocuments();
        console.log(`\n[youranimehub] Categories Count: ${categoriesCount}`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkLocalEnvData();
