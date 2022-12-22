// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDemZ7SYdMSizMdbTsr8ZFbEdT2ZCwI1RM",
  authDomain: "my-limo-company-3953e.firebaseapp.com",
  databaseURL: "https://my-limo-company-3953e-default-rtdb.firebaseio.com",
  projectId: "my-limo-company-3953e",
  storageBucket: "my-limo-company-3953e.appspot.com",
  messagingSenderId: "996599405321",
  appId: "1:996599405321:web:bc1ade0ab33b3872c111d8",
  measurementId: "G-YTZBKKQM7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app