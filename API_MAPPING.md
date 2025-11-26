# Frontend to Backend API Mapping

This document shows how the frontend functionality maps to backend API endpoints.

## Frontend Implementation (Current)
The frontend currently uses Firebase Client SDK directly:
- `frontend/main.js` - Direct Firestore operations
- `frontend/firebase.js` - Firebase client initialization

## Backend API Endpoints (Alternative)

### Blood Donation

**Frontend:** Direct Firestore write
```javascript
await addDoc(collection(db, 'blood_donors'), {...});
```

**Backend Alternative:**
```
POST /api/blood/register
Body: {
  name, blood_type, city, phone, email
}
```

**Frontend:** Direct Firestore query
```javascript
query(collection(db, 'blood_donors'), 
  where('blood_type', '==', bloodType),
  where('city_lower', '==', city.toLowerCase())
)
```

**Backend Alternative:**
```
GET /api/blood/search?bloodType=A+&city=Mysuru
```

### Organ Donation

**Frontend:** Direct Firestore write
```javascript
await addDoc(collection(db, 'organ_donors'), {...});
```

**Backend Alternative:**
```
POST /api/organ/register
Body: {
  name, age, blood_group, city, phone, email,
  organs[], emergency_contact_name, 
  emergency_contact_phone, consent
}
```

### Death Notification

**Frontend:** Direct Firestore write
```javascript
await addDoc(collection(db, 'death_notifications'), {...});
```

**Backend Alternative:**
```
POST /api/death/notify
Body: {
  name, hospital, contact
}
```

### Authentication

**Frontend:** Firebase Auth Client SDK
```javascript
signInWithEmailAndPassword(auth, email, password)
createUserWithEmailAndPassword(auth, email, password)
```

**Backend Alternative (for server-side verification):**
```
POST /api/auth/verify-token
Body: { idToken }
```

## Usage Options

### Option 1: Keep Current Setup (Recommended for Simple Apps)
- Frontend uses Firebase Client SDK directly
- No backend server needed
- Faster, simpler architecture

### Option 2: Use Backend API
- Frontend calls backend REST API
- Backend uses Firebase Admin SDK
- Better for:
  - Server-side validation
  - Admin operations
  - Integration with other services
  - Centralized business logic

### Option 3: Hybrid Approach
- Public operations: Direct Firebase Client SDK
- Admin operations: Backend API with authentication
- Best of both worlds

## Frontend Integration Example

If you want to use the backend API instead of direct Firestore:

```javascript
// Instead of:
await addDoc(collection(db, 'blood_donors'), {...});

// Use:
const response = await fetch('http://localhost:3000/api/blood/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: data.name,
    blood_type: data.blood_type,
    city: data.city,
    phone: data.phone,
    email: data.email
  })
});
const result = await response.json();
```

