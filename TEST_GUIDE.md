# Test Authentication Flow

This file contains example requests to test the authentication system.

## 🚀 Getting Started

1. Start the server:
```bash
npm run dev
```

2. Use the following endpoints for testing:

## 📋 Test Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    "email": "test@example.com",
    "isVerified": false
  }
}
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully! Welcome to Toolshub API.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "Test User",
      "email": "test@example.com",
      "isVerified": true,
      "apiKey": "key_romztools...",
      "hitLimit": 1000,
      "hitCount": 0
    }
  }
}
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### 4. Access Dashboard (requires JWT token)
```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Test API Key
```bash
curl -X GET http://localhost:3000/api/tools/test \
  -H "X-API-Key: YOUR_API_KEY"
```

### 6. Resend OTP
```bash
curl -X POST http://localhost:3000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 🔧 PowerShell Commands (Windows)

### Register User
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"Test123"}'
```

### Verify OTP
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/verify-otp" -Method Post -ContentType "application/json" -Body '{"email":"test@example.com","otp":"123456"}'
```

### Login
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"test@example.com","password":"Test123"}'
```

## 📊 Expected Email Flow

1. **Register** → OTP email sent to user
2. **Check Email** → Copy 6-digit OTP code
3. **Verify OTP** → Account activated + API key generated
4. **Welcome Email** → Confirmation with API key details
5. **Login** → Access dashboard and tools

## ⚠️ Common Issues

- **Port 3000 in use**: Change PORT in .env or kill existing Node processes
- **Email not sending**: Check EMAIL_USER and EMAIL_PASS in .env
- **MongoDB connection**: Ensure MongoDB is running
- **Rate limiting**: 5 requests/hour per IP for auth endpoints

## 🐛 Debugging

Check server logs for detailed error messages:
- Registration errors
- Email sending status
- Database connection issues
- Validation errors