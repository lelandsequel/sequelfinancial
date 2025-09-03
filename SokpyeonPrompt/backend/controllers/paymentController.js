const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userService = require('../services/userService');

// Replace with your actual Stripe price IDs from https://dashboard.stripe.com/products
const PRICE_IDS = {
  payperuse: 'price_1ABC123DEF456GHI789', // One-time payment for single prompt
  starter: 'price_1DEF456GHI789JKL012',   // Monthly subscription - 5 prompts
  pro: 'price_1GHI789JKL012MNO345',       // Monthly subscription - 15 prompts
  unlimited: 'price_1JKL012MNO345PQR678'  // Monthly subscription - unlimited prompts
};

const createCheckoutSession = async (req, res) => {
  try {
    const { tier } = req.body;
    const user = await userService.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const session = await stripe.checkout.sessions.create({
      mode: tier === 'payperuse' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: PRICE_IDS[tier],
        quantity: 1
      }],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: user.email,
      metadata: { userId: user.id }
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const user = await userService.findById(userId);
    if (user) {
      if (session.mode === 'payment') {
        // Pay-per-use - increment usage by 1
        await userService.update(userId, {
          maxUsage: user.maxUsage + 1,
          subscriptionTier: 'payperuse'
        });
      } else {
        // Subscription - find tier by price ID
        const priceId = session.line_items?.data?.[0]?.price?.id;
        const subscriptionTier = Object.keys(PRICE_IDS).find(key => PRICE_IDS[key] === priceId) || 'free';
        await userService.update(userId, {
          subscriptionTier,
          maxUsage: getMaxUsage(subscriptionTier),
          usageCount: 0,
          lastReset: new Date(),
          stripeCustomerId: session.customer
        });
      }
    }
  }

  // Handle subscription updates (optional - for future use)
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const user = await userService.findByStripeCustomerId(subscription.customer);
    if (user) {
      const priceId = subscription.items.data[0].price.id;
      const subscriptionTier = Object.keys(PRICE_IDS).find(key => PRICE_IDS[key] === priceId) || 'free';
      await userService.update(user.id, {
        subscriptionTier,
        maxUsage: getMaxUsage(subscriptionTier)
      });
    }
  }

  // Handle subscription cancellations
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const user = await userService.findByStripeCustomerId(subscription.customer);
    if (user) {
      await userService.update(user.id, {
        subscriptionTier: 'free',
        maxUsage: 0
      });
    }
  }

  res.json({ received: true });
};

function getMaxUsage(tier) {
  switch (tier) {
    case 'starter': return 5;
    case 'pro': return 15;
    case 'unlimited': return Infinity;
    default: return 0;
  }
}

module.exports = { createCheckoutSession, webhook }; 