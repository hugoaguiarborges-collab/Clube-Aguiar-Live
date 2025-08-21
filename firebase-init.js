// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Site estático NÃO lê process.env. Use valores literais do seu Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
  authDomain: "clube-aguiar-live.firebaseapp.com",
  projectId: "clube-aguiar-live",
  // bucket padrão do Firebase Storage:
  storageBucket: "clube-aguiar-live.appspot.com",
  messagingSenderId: "694025911850",
  appId: "1:694025911850:web:5f0c6117dbc60b15118d53"
};

const app = initializeApp(firebaseConfig);

// Autenticação anônima para funcionar com as regras
const auth = getAuth(app);
signInAnonymously(auth).catch(console.error);

// Deixa o app disponível para outros scripts
window.__firebaseApp = app;

