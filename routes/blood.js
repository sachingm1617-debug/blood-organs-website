// Blood Donor Routes
const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const { db, admin } = require('../config/firebase-admin');
const { verifyToken } = require('../middleware/auth');

// Register a new blood donor
// POST /api/blood/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('blood_type').trim().notEmpty().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Valid blood type is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('address').optional().trim()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, blood_type, city, phone, email, address } = req.body;

    // Add document to Firestore
    const docRef = await db.collection('blood_donors').add({
      name: name.trim(),
      blood_type: blood_type.toUpperCase(),
      city: city.trim(),
      city_lower: city.toLowerCase().trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      address: address ? address.trim() : '',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      success: true,
      message: 'Blood donor registration successful',
      id: docRef.id
    });
  } catch (error) {
    console.error('Blood registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Search blood donors
// GET /api/blood/search?bloodType=A+&city=Mysuru
router.get('/search', [
  query('bloodType').trim().notEmpty().withMessage('Blood type is required'),
  query('city').trim().notEmpty().withMessage('City is required')
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

    const { bloodType, city } = req.query;

    // Query Firestore
    const snapshot = await db.collection('blood_donors')
      .where('blood_type', '==', bloodType.toUpperCase())
      .where('city_lower', '==', city.toLowerCase().trim())
      .orderBy('created_at', 'desc')
      .get();

    const donors = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      donors.push({
        id: doc.id,
        name: data.name,
        blood_type: data.blood_type,
        city: data.city,
        phone: data.phone,
        email: data.email || ''
      });
    });

    res.json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    console.error('Blood search error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Get all blood donors (admin only - requires auth)
// GET /api/blood/all
router.get('/all', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('blood_donors')
      .orderBy('created_at', 'desc')
      .limit(100)
      .get();

    const donors = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      donors.push({
        id: doc.id,
        ...data
      });
    });

    res.json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    console.error('Get all donors error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

module.exports = router;

