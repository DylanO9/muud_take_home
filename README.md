# Muud Journal App

A mobile journal application that allows users to track their daily thoughts and moods.

## Local Setup and Testing

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run start
   ```
5. Use the Expo Go app on your mobile device to scan the QR code and run the application

## Technologies Used

- **Frontend:**
  - React Native
  - Expo
  - React Navigation
  - AsyncStorage for local data persistence

- **Backend:**
  - Supabase
  - PostgreSQL
  - Render (Hosting)

- **Testing:**
  - Postman
  - Jest

## Important Notes

- The first API request may be slow due to Render's free tier service limitations
- When signing up, please ensure to type your username exactly as written, including capitalizations
- The application assumes that journal entries and history are separate screens for better user experience

## Backend Deployment

The backend is deployed on Render and can be accessed at:
https://muud-take-home.onrender.com/

## Assumptions

- Journal entry and history are implemented as separate screens for better user experience and organization
- Users need to be authenticated to access and add journal entries
- Users need to be authenticated to access and add contacts
- Each journal entry includes both text content and a mood rating 