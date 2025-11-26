// Death Notification Routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db, admin } = require('../config/firebase-admin');

// Submit death notification
// POST /api/death/notify
router.post('/notify', [
  body('name').trim().notEmpty().withMessage('Donor name is required'),
  body('hospital').trim().notEmpty().withMessage('Hospital/reporter name is required'),
  body('contact').trim().notEmpty().withMessage('Contact number is required'),
  body('address').optional().trim()
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

    const { name, hospital, contact, address } = req.body;

    const docRef = await db.collection('death_notifications').add({
      name: name.trim(),
      hospital: hospital.trim(),
      contact: contact.trim(),
      address: address ? address.trim() : '',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      success: true,
      message: 'Death notification successfully sent',
      id: docRef.id
    });
  } catch (error) {
    console.error('Death notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Get all death notifications (admin only)
// GET /api/death/all
router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.collection('death_notifications')
      .orderBy('created_at', 'desc')
      .limit(100)
      .get();

    const notifications = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        ...data
      });
    });

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

module.exports = router;

