import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCbbK2RqCzBKgnp8erVfp558_StZVNfmHo",
  authDomain: "solar-be7a2.firebaseapp.com",
  projectId: "solar-be7a2",
  storageBucket: "solar-be7a2.firebasestorage.app",
  messagingSenderId: "696212492878",
  appId: "1:696212492878:web:4b55311fc594879e90a91f",
  measurementId: "G-GFH160VTMM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función simple para iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Inicio de sesión exitoso:', userCredential.user.email);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return { user: null, error: error.message };
  }
};
