// api/server.js

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { Title, Description, Amount, Image } = req.body;

    try {
        // PaymentIntent create karna
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Amount * 100,
            currency: 'gbp',
            description: `${Title} - ${Description}`,
            metadata: { 
                title: Title,
                image: Image
            }
        });
        // clientSecret frontend ko bhejna
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment intent create karte waqt error:', error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
};
