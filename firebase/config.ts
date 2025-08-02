// Firebase Authentication Configuration
// Replace these values with your actual OAuth client IDs

export const FIREBASE_AUTH_CONFIG = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google OAuth client ID

  // Apple OAuth Configuration
  APPLE_CLIENT_ID: 'YOUR_APPLE_CLIENT_ID', // Replace with your Apple OAuth client ID

  // App Configuration
  APP_SCHEME: 'timora',
  APP_PATH: 'auth',
};

// Instructions for setting up OAuth:
//
// 1. Google OAuth Setup:
//    - Go to Google Cloud Console (https://console.cloud.google.com/)
//    - Create a new project or select existing one
//    - Enable Google+ API
//    - Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
//    - Add your app's bundle identifier and redirect URIs
//    - Copy the client ID and replace GOOGLE_CLIENT_ID above
//
// 2. Apple OAuth Setup:
//    - Go to Apple Developer Console (https://developer.apple.com/)
//    - Create a new App ID or use existing one
//    - Enable Sign In with Apple capability
//    - Create a Services ID for your app
//    - Configure the redirect URI
//    - Copy the client ID and replace APPLE_CLIENT_ID above
//
// 3. Firebase Console Setup:
//    - Go to Firebase Console (https://console.firebase.google.com/)
//    - Select your project
//    - Go to Authentication > Sign-in method
//    - Enable Email/Password, Google, and Apple providers
//    - Configure the OAuth client IDs in Firebase console as well
//
// 4. Environment Variables:
//    - Add your Firebase configuration to app.config.ts or environment variables
//    - Make sure all Firebase config values are properly set

export default FIREBASE_AUTH_CONFIG;
