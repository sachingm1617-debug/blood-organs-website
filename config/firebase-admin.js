// Firebase Admin SDK initialization
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
// Option 1: Using service account key file (recommended for development)
try {
  const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'blood-9ce8f'
  });
} catch (error) {
  // Option 2: Using environment variables (for production)
  // Set GOOGLE_APPLICATION_CREDENTIALS environment variable
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID || 'blood-9ce8f'
    });
  } else {
    console.error('Firebase Admin SDK initialization failed:', error.message);
    console.error('Please provide serviceAccountKey.json or set GOOGLE_APPLICATION_CREDENTIALS');
    process.exit(1);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

