import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

// import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIEQuCM4zTNxOTCW-B3ycaTls681oW6nw",
  authDomain: "palastinian-clinic.firebaseapp.com",
  projectId: "palastinian-clinic",
  storageBucket: "palastinian-clinic.appspot.com",
  messagingSenderId: "269828176464",
  appId: "1:269828176464:web:e2199f8522a351a1c4af55",
  measurementId: "G-D6Y65D0N99",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

// export const analytics = getAnalytics(app);
