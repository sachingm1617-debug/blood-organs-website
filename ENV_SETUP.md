# Environment Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Get Firebase Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `blood-9ce8f`
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in the `backend` folder

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=blood-9ce8f
   CORS_ORIGIN=http://localhost:8080,http://localhost
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

## Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Register Blood Donor
```bash
curl -X POST http://localhost:3000/api/blood/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "blood_type": "O+",
    "city": "Mysuru",
    "phone": "1234567890",
    "email": "john@example.com"
  }'
```

### Search Blood Donors
```bash
curl "http://localhost:3000/api/blood/search?bloodType=O+&city=Mysuru"
```

