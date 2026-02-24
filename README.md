# 🎵 Jocky Backend API

Production-ready Node.js + Express + PostgreSQL backend for the Jocky event booking platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your database credentials

# 3. Create database
createdb jocky_db

# 4. Setup database tables
npm run db:setup

# 5. Start development server
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register   - Register new user (venue or artist)
POST   /api/auth/login      - Login
GET    /api/auth/me         - Get current user (requires auth)
```

### Events
```
GET    /api/events          - List all events
POST   /api/events          - Create event (venue only)
GET    /api/events/:id      - Get single event
PUT    /api/events/:id      - Update event (venue only)
DELETE /api/events/:id      - Delete event (venue only)
```

### Bookings
```
POST   /api/bookings        - Send offer to artist
PUT    /api/bookings/:id    - Accept/Decline offer (artist)
```

### Artists
```
GET    /api/artists         - List all artists
```

### Venues
```
GET    /api/venues          - List all venues
```

### Messages
```
GET    /api/messages        - Get conversations
```

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Example login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "venue@example.com", "password": "password123"}'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "venue@example.com",
    "role": "venue"
  }
}
```

---

## 📊 Database Schema

### Tables
- `users` - All users (venues & artists)
- `venues` - Venue details
- `artists` - Artist profiles
- `events` - Event/gig details
- `bookings` - Artist bookings for events
- `messages` - Chat messages
- `dance_floors` - Venue dance floors
- `artist_requests` - Artist application requests

---

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Register a venue
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@venue.com",
    "password": "test123",
    "role": "venue",
    "name": "Test Venue",
    "phone": "+46701234567"
  }'

# Create an event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "event_name": "Friday Night",
    "event_date": "2026-03-20",
    "start_time": "20:00",
    "end_time": "23:00",
    "amount_sek": 5000,
    "frequency": "single"
  }'
```

---

## 🚀 Deployment

### Railway.app (Recommended)
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add PostgreSQL
railway add postgresql

# 5. Deploy
railway up
```

### Render.com
1. Connect GitHub repo
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

### Environment Variables (Production)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

---

## 📁 Project Structure

```
jocky-backend/
├── src/
│   ├── config/
│   │   └── database.js        # Database connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── event.controller.js
│   │   └── booking.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT verification
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   └── ...
│   └── server.js              # Express app
├── scripts/
│   └── setup-database.js      # DB schema setup
├── .env.example
├── package.json
└── README.md
```

---

## 🔧 Development

```bash
# Start dev server with auto-reload
npm run dev

# Setup fresh database
npm run db:setup

# Seed test data (coming soon)
npm run db:seed
```

---

## 🐛 Troubleshooting

**Database connection error:**
- Check PostgreSQL is running: `psql -U postgres`
- Verify .env credentials match database

**Token expired:**
- Tokens expire after 7 days
- Login again to get new token

**CORS error:**
- Update FRONTEND_URL in .env
- Restart server

---

## 📝 License

MIT

## 👥 Author

Built for Jocky - Event Booking Platform
