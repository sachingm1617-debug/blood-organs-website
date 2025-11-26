// Organ Donor Routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db, admin } = require('../config/firebase-admin');

// Register a new organ donor
// POST /api/organ/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Valid age is required'),
  body('blood_group').trim().notEmpty().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Valid blood group is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').optional().trim(),
  body('organs').isArray().withMessage('Organs must be an array'),
  body('emergency_contact_name').trim().notEmpty().withMessage('Emergency contact name is required'),
  body('emergency_contact_phone').trim().notEmpty().withMessage('Emergency contact phone is required'),
  body('consent').isBoolean().withMessage('Consent must be a boolean')
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

    const {
      name,
      age,
      blood_group,
      city,
      phone,
      email,
      address,
      organs,
      emergency_contact_name,
      emergency_contact_phone,
      consent
    } = req.body;

    // Process organs array
    const organsList = Array.isArray(organs) ? organs : (typeof organs === 'string' ? organs.split(',') : []);

    const docRef = await db.collection('organ_donors').add({
      name: name.trim(),
      age: age ? parseInt(age) : null,
      blood_group: blood_group.toUpperCase(),
      city: city.trim(),
      city_lower: city.toLowerCase().trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address ? address.trim() : '',
      organs: organsList,
      emergency_contact_name: emergency_contact_name.trim(),
      emergency_contact_phone: emergency_contact_phone.trim(),
      consent: consent === true || consent === 1,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      success: true,
      message: 'Organ donor registration successful',
      id: docRef.id
    });
  } catch (error) {
    console.error('Organ registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Get all organ donors (admin only - requires auth)
// GET /api/organ/all
router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.collection('organ_donors')
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
    console.error('Get all organ donors error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

module.exports = router;

