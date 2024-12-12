import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCbbK2RqCzBKgnp8erVfp558_StZVNfmHo",
  authDomain: "solar-be7a2.firebaseapp.com",
  projectId: "solar-be7a2",
  storageBucket: "solar-be7a2.firebasestorage.app",
  messagingSenderId: "696212492878",
  appId: "1:696212492878:web:4b55311fc594879e90a91f",
  measurementId: "G-GFH160VTMM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
