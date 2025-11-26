// Authentication Routes (using Firebase Admin SDK)
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { auth, admin } = require('../config/firebase-admin');

// Create custom token for user (alternative to client-side auth)
// POST /api/auth/create-token
router.post('/create-token', [
  body('uid').trim().notEmpty().withMessage('User ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { uid } = req.body;
    const customToken = await admin.auth().createCustomToken(uid);

    res.json({
      success: true,
      token: customToken
    });
  } catch (error) {
    console.error('Create token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create token',
      error: error.message
    });
  }
});

// Verify ID token (for server-side verification)
// POST /api/auth/verify-token
router.post('/verify-token', [
  body('idToken').trim().notEmpty().withMessage('ID token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
});

// Get user by UID
// GET /api/auth/user/:uid
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userRecord = await admin.auth().getUser(uid);

    res.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        createdAt: userRecord.metadata.creationTime
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: error.message
    });
  }
});

module.exports = router;

