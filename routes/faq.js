// FAQ Routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db, admin } = require('../config/firebase-admin');
const { sendEmail } = require('../config/email');

// Send reply to FAQ question
// POST /api/faq/reply
router.post('/reply', [
  body('questionId').trim().notEmpty().withMessage('Question ID is required'),
  body('reply').trim().notEmpty().withMessage('Reply is required'),
  body('email').isEmail().withMessage('Valid email is required')
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

    const { questionId, reply, email, userName } = req.body;

    // Update the question with the reply
    await db.collection('faq_questions').doc(questionId).update({
      admin_reply: reply,
      replied_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send email to user
    const emailSubject = 'Reply to Your Question - Donate Life';
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d62828; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .reply-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #d62828; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donate Life</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName || 'User'},</h2>
            <p>Thank you for contacting Donate Life. We have received your question and here is our response:</p>
            
            <div class="reply-box">
              <strong>Admin Reply:</strong>
              <p>${reply}</p>
            </div>
            
            <p>If you have any further questions, please feel free to contact us again.</p>
            
            <p>Best regards,<br><strong>Donate Life Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Donate Life. All Rights Reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResult = await sendEmail(email, emailSubject, emailHtml);

    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Reply sent successfully via email'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Reply saved but email failed to send',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('FAQ reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reply',
      error: error.message
    });
  }
});

module.exports = router;
