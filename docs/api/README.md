# API Documentation

## Base URL
```
https://muud-take-home.onrender.com
```

## Authentication
All protected endpoints require a JWT token to be included in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Users

#### Sign Up
```http
POST /users/signup
```

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (201 Created):
```json
{
  "user": {
    "user_id": "number",
    "username": "string",
    "password_hash": "string"
  },
  "token": "string"
}
```

#### Login
```http
POST /users/login
```

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (200 OK):
```json
{
  "user": {
    "user_id": "number",
    "username": "string",
    "password_hash": "string"
  },
  "token": "string"
}
```

#### Get User Profile
```http
GET /users/me
```

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "user_id": "number",
  "username": "string",
  "password_hash": "string"
}
```

#### Delete User
```http
DELETE /users
```

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "message": "User deleted successfully"
}
```

### Journal

#### Create Journal Entry
```http
POST /journal/entry
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "entry_text": "string",
  "mood_rating": "number (1-5)"
}
```

Response (201 Created):
```json
{
  "success": true,
  "journal_entry_id": "number"
}
```

#### Get User Journal Entries
```http
GET /journal/user/:id
```

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
[
  {
    "journal_entry_id": "number",
    "user_id": "number",
    "entry_text": "string",
    "mood_rating": "number",
    "timestamp": "string (ISO date)"
  }
]
```

### Contacts

#### Add Contact
```http
POST /contacts/add
```

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "contact_name": "string",
  "contact_email": "string"
}
```

Response (201 Created):
```json
{
  "success": true,
  "contact": {
    "contact_id": "number",
    "user_id": "number",
    "contact_name": "string",
    "contact_email": "string"
  }
}
```

#### Get User Contacts
```http
GET /contacts/user/:id
```

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
[
  {
    "contact_id": "number",
    "user_id": "number",
    "contact_name": "string",
    "contact_email": "string"
  }
]
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string (error message)"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "string (error message)"
}
```

### 500 Internal Server Error
```json
{
  "error": "string (error message)"
}
``` 