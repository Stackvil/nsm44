const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/checkout', ensureAuthenticated, paymentController.getCheckout);
router.post('/checkout', ensureAuthenticated, paymentController.processPayment);

module.exports = router;
