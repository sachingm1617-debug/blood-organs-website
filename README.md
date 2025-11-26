# Donate Life Backend API

Node.js/Express backend API for the Donate Life application using Firebase Admin SDK.

## Features

- ✅ Blood donor registration and search
- ✅ Organ donor registration
- ✅ Death notification submission
- ✅ Firebase Authentication integration
- ✅ RESTful API endpoints
- ✅ Input validation
- ✅ CORS support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- Firebase Admin SDK service account key

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Firebase Admin SDK Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`blood-9ce8f`)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend` folder

**⚠️ IMPORTANT:** Never commit `serviceAccountKey.json` to version control!

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=blood-9ce8f
CORS_ORIGIN=http://localhost:8080,http://localhost
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health` - Check if API is running

### Blood Donors
- **POST** `/api/blood/register` - Register a new blood donor
- **GET** `/api/blood/search?bloodType=A+&city=Mysuru` - Search blood donors
- **GET** `/api/blood/all` - Get all blood donors (requires auth)

### Organ Donors
- **POST** `/api/organ/register` - Register a new organ donor
- **GET** `/api/organ/all` - Get all organ donors (requires auth)

### Death Notifications
- **POST** `/api/death/notify` - Submit death notification
- **GET** `/api/death/all` - Get all notifications (requires auth)

### Authentication
- **POST** `/api/auth/create-token` - Create custom token
- **POST** `/api/auth/verify-token` - Verify ID token
- **GET** `/api/auth/user/:uid` - Get user by UID

## Request/Response Examples

### Register Blood Donor
```bash
POST /api/blood/register
Content-Type: application/json

{
  "name": "John Doe",
  "blood_type": "O+",
  "city": "Mysuru",
  "phone": "1234567890",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blood donor registration successful",
  "id": "abc123xyz"
}
```

### Search Blood Donors
```bash
GET /api/blood/search?bloodType=O+&city=Mysuru
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "donors": [
    {
      "id": "abc123",
      "name": "John Doe",
      "blood_type": "O+",
      "city": "Mysuru",
      "phone": "1234567890",
      "email": "john@example.com"
    }
  ]
}
```

### Register Organ Donor
```bash
POST /api/organ/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "age": 30,
  "blood_group": "A+",
  "city": "Bangalore",
  "phone": "9876543210",
  "email": "jane@example.com",
  "organs": ["Heart", "Kidney", "Liver"],
  "emergency_contact_name": "Bob Smith",
  "emergency_contact_phone": "9876543211",
  "consent": true
}
```

## Authentication

For protected endpoints, include the Firebase ID token in the Authorization header:

```bash
Authorization: Bearer <firebase-id-token>
```

To get the ID token from the frontend:
```javascript
import { auth } from './firebase.js';
const token = await auth.currentUser.getIdToken();
```

## Project Structure

```
backend/
├── config/
│   └── firebase-admin.js    # Firebase Admin SDK initialization
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── blood.js             # Blood donor routes
│   ├── organ.js             # Organ donor routes
│   ├── death.js             # Death notification routes
│   └── auth.js              # Authentication routes
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

## Security Notes

1. **Never commit `serviceAccountKey.json`** - It has admin privileges
2. Use environment variables for sensitive configuration
3. Enable CORS only for trusted origins in production
4. Validate all input data
5. Use authentication middleware for protected routes

## Troubleshooting

### Firebase Admin SDK Error
- Ensure `serviceAccountKey.json` is in the `backend` folder
- Check that the file is valid JSON
- Verify the project ID matches your Firebase project

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 3000

### CORS Errors
- Update `CORS_ORIGIN` in `.env` with your frontend URL
- Or set it to `*` for development (not recommended for production)

## License

ISC

