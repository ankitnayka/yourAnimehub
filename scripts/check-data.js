const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ankitnayka:0K3Y2S8hyU8YzAbQ@admin.fbev97k.mongodb.net/abc';

async function checkData() {
    console.log('Connecting to MongoDB...');
    try {
        const conn = await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected');

        // Check Products
        const productsCount = await conn.connection.db.collection('products').countDocuments();
        console.log(`\nProducts Count: ${productsCount}`);

        if (productsCount > 0) {
            const products = await conn.connection.db.collection('products').find({}).limit(3).toArray();
            console.log('First 3 Products:');
            console.log(JSON.stringify(products, null, 2));
        }

        // Check Categories
        const categoriesCount = await conn.connection.db.collection('categories').countDocuments();
        console.log(`\nCategories Count: ${categoriesCount}`);

        if (categoriesCount > 0) {
            const categories = await conn.connection.db.collection('categories').find({}).limit(3).toArray();
            console.log('First 3 Categories:');
            console.log(JSON.stringify(categories, null, 2));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkData();
