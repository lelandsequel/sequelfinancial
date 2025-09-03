const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

class UserService {
  constructor() {
    this.collection = 'users';
  }

  // Create a new user
  async create(userData) {
    try {
      const userRef = db.collection(this.collection).doc();
      const user = {
        ...userData,
        id: userRef.id,
        createdAt: new Date(),
        lastReset: new Date()
      };

      await userRef.set(user);
      return { ...user, id: userRef.id };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const snapshot = await db.collection(this.collection)
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const doc = await db.collection(this.collection).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by Stripe customer ID
  async findByStripeCustomerId(stripeCustomerId) {
    try {
      const snapshot = await db.collection(this.collection)
        .where('stripeCustomerId', '==', stripeCustomerId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error finding user by Stripe customer ID:', error);
      throw error;
    }
  }

  // Update user
  async update(id, updateData) {
    try {
      await db.collection(this.collection).doc(id).update(updateData);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get user without password field
  async findByIdWithoutPassword(id) {
    try {
      const user = await this.findById(id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      console.error('Error finding user without password:', error);
      throw error;
    }
  }

  // Check and reset monthly usage
  async checkAndResetUsage(user) {
    if (['starter', 'pro', 'unlimited'].includes(user.subscriptionTier)) {
      const now = new Date();
      const lastReset = user.lastReset ? user.lastReset.toDate() : new Date();
      const last = new Date(lastReset);

      if (now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear()) {
        await this.update(user.id, {
          usageCount: 0,
          lastReset: now
        });
        user.usageCount = 0;
        user.lastReset = now;
      }
    }
    return user;
  }
}

module.exports = new UserService();