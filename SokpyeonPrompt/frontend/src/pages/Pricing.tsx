import { useContext } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '../context/AuthContext';

// Replace with your actual Stripe publishable key from https://dashboard.stripe.com/apikeys
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

function Pricing() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  const { token } = context;

  const handleSubscribe = async (tier: string) => {
    try {
      const res = await axios.post('/api/payments/create-checkout-session', { tier }, { headers: { 'x-auth-token': token } });
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId: res.data.id });
      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl">Pricing Plans</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border">
          Pay-Per-Use: $3.99 / prompt
          <button onClick={() => handleSubscribe('payperuse')} className="mt-2 p-2 bg-blue-500 text-white">Buy Now</button>
        </div>
        <div className="p-4 border">
          Starter: $14.99/month - 5 prompts
          <button onClick={() => handleSubscribe('starter')} className="mt-2 p-2 bg-blue-500 text-white">Subscribe</button>
        </div>
        <div className="p-4 border">
          Pro: $29.99/month - 15 prompts
          <button onClick={() => handleSubscribe('pro')} className="mt-2 p-2 bg-blue-500 text-white">Subscribe</button>
        </div>
        <div className="p-4 border">
          Unlimited: $49.99/month - Unlimited
          <button onClick={() => handleSubscribe('unlimited')} className="mt-2 p-2 bg-blue-500 text-white">Subscribe</button>
        </div>
      </div>
    </div>
  );
}

export default Pricing; 