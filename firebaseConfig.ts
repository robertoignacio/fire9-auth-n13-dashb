import { getApps, initializeApp } from "firebase/app";
// getApps()	A (read-only) array of all initialized apps.
// initializeApp()	Creates and initializes a FirebaseApp instance.

// import firebase auth here to use it in the other files without having to import it at each file
import { getAuth } from "firebase/auth";

// the Firebase config object
const firebaseConfig: object = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  //measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// initialize Firebase client, export it to use it in the other files
export const app = initializeApp(firebaseConfig);

// if the array of initialized apps is empty, initialize Firebase
if (!getApps().length) {
  // Initialize Firebase
  initializeApp(firebaseConfig);
}

// failsafe: export the function that initializes Firebase, return the initialized app:
export const initFirebase = () => {
    return app
}

// export the auth function: pass the app object to getAuth() to get the auth service
export const auth = getAuth(app);


