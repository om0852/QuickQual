# Database Setup Guide

## MongoDB Connection

This project uses MongoDB to store user data including username, fullname, score, and response_time.

### Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
# MongoDB Connection String
# For local development, use: mongodb://localhost:27017/responsegame
# For MongoDB Atlas, use your connection string from the Atlas dashboard
MONGODB_URI=mongodb://localhost:27017/responsegame
```

### Local MongoDB Setup

1. Install MongoDB locally or use Docker:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Or install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)

### MongoDB Atlas Setup (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `.env.local`

## API Endpoints

### Users

- `GET /api/users` - Get all users (with optional search, limit, sort)
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user by ID
- `DELETE /api/users/[id]` - Delete user by ID

### Score Management

- `GET /api/users/[id]/score` - Get user score
- `PUT /api/users/[id]/score` - Update user score and response time

### Leaderboard

- `GET /api/leaderboard` - Get leaderboard (top users by score)

## Usage Examples

### Create a User
```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'player1',
    fullname: 'John Doe',
    score: 0,
    response_time: 0
  })
});
```

### Update Score
```javascript
const response = await fetch('/api/users/[userId]/score', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    increment: 10, // Add 10 to current score
    response_time: 1.5 // Update response time
  })
});
```

### Get Leaderboard
```javascript
const response = await fetch('/api/leaderboard?limit=10&sortBy=score&order=desc');
const data = await response.json();
```
