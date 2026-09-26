const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    changeType: {
        type: String,
        required: true,
        enum: ['sale', 'return', 'exchange_in', 'exchange_out', 'restock', 'adjustment']
    },
    quantityChange: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    referenceId: { type: String },
    referenceType: { type: String, enum: ['Order', 'Return', 'Exchange', 'Manual'] },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    performedByName: { type: String, required: true },
    notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('StockLog', stockLogSchema);
