const { getProductIndex } = require('../config/meilisearch');

async function addOrUpdateProductInSearch(product) {
    try {
        const index = await getProductIndex();
        const document = {
            id: String(product._id),
            name: product.name,
            category: product.category,
            gender: product.gender,
            price: product.price,
            status: product.status,
            in_stock: product.in_stock,
            description: product.description || '',
            image_url: product.image_url || '',
            rating: product.rating || 0,
            reviews_count: product.reviews_count || 0,
            createdAt: product.createdAt || new Date(),
        };
        await index.addDocuments([document]);
    } catch (error) {
        console.error('Meilisearch addOrUpdateProductInSearch error:', error.message);
    }
}

async function removeProductFromSearch(productId) {
    try {
        const index = await getProductIndex();
        await index.deleteDocument(String(productId));
    } catch (error) {
        console.error('Meilisearch removeProductFromSearch error:', error.message);
    }
}

async function syncAllProducts() {
    try {
        const Product = require('../models/Product');
        const products = await Product.find({});
        const index = await getProductIndex();
        const documents = products.map((product) => ({
            id: String(product._id),
            name: product.name,
            category: product.category,
            gender: product.gender,
            price: product.price,
            status: product.status,
            in_stock: product.in_stock,
            description: product.description || '',
            image_url: product.image_url || '',
            rating: product.rating || 0,
            reviews_count: product.reviews_count || 0,
            createdAt: product.createdAt || new Date(),
        }));
        await index.addDocuments(documents);
        console.log(`Synced ${documents.length} products to Meilisearch`);
        return { synced: documents.length };
    } catch (error) {
        console.error('Meilisearch syncAllProducts error:', error.message);
        throw error;
    }
}

module.exports = {
    addOrUpdateProductInSearch,
    removeProductFromSearch,
    syncAllProducts,
};
