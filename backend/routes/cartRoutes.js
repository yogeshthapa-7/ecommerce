const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.post('/update', auth, cartController.updateCartItem);
router.post('/remove', auth, cartController.removeFromCart);
router.delete('/clear', auth, cartController.clearCart);
router.post('/sync', auth, cartController.syncCart);

module.exports = router;
