require('dotenv').config();
const { Meilisearch } = require('meilisearch');

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'http://127.0.0.1:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'aMasterKey';
const PRODUCT_INDEX_UID = process.env.MEILISEARCH_PRODUCT_INDEX || 'products';

const client = new Meilisearch({
    host: MEILISEARCH_URL,
    apiKey: MEILISEARCH_API_KEY,
});

let productIndex = null;

async function getProductIndex() {
    if (!productIndex) {
        productIndex = client.index(PRODUCT_INDEX_UID);
        try {
            await productIndex.updateSettings({
                searchableAttributes: [
                    'name',
                    'category',
                    'gender',
                    'description',
                ],
                filterableAttributes: [
                    'category',
                    'gender',
                    'price',
                    'in_stock',
                    'status',
                ],
                sortableAttributes: [
                    'price',
                    'createdAt',
                    'rating',
                    'reviews_count',
                ],
            });
        } catch (error) {
            console.error('Meilisearch settings update failed:', error.message);
        }
    }
    return productIndex;
}

module.exports = {
    client,
    getProductIndex,
    PRODUCT_INDEX_UID,
};
