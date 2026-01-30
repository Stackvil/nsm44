const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckout = (req, res) => {
    res.render('payment/checkout', {
        key: process.env.STRIPE_PUBLISHABLE_KEY
    });
};

exports.processPayment = async (req, res) => {
    try {
        const { amount, currency = 'usd', source } = req.body;

        // This is a placeholder for actual charge creation
        // const charge = await stripe.charges.create({
        //     amount: amount * 100,
        //     currency: currency,
        //     source: source,
        //     description: 'Example Charge'
        // });

        req.flash('success_msg', 'Payment processed successfully (Mock)');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Payment failed');
        res.redirect('/payment/checkout');
    }
};
