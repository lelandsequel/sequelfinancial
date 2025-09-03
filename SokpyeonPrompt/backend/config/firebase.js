const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  if (!admin.apps.length) {
    // You can initialize with either:
    // 1. Service account key file (recommended for server)
    // 2. Environment variables

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Method 1: Service account key from environment variable (JSON string)
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      // Method 2: Service account key file path
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
    } else {
      // Method 3: Default credentials (for Google Cloud environments)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
  }

  return admin.firestore();
};

const db = initializeFirebase();

module.exports = { db, admin };