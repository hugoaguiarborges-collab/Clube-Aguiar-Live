// Importando funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
  authDomain: "clube-aguiar-live.firebaseapp.com",
  projectId: "clube-aguiar-live",
  storageBucket: "clube-aguiar-live.appspot.com",
  messagingSenderId: "694025911850",
  appId: "1:694025911850:web:5f0c6117dbc60b15118d53"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Exportando serviços para usar em outros arquivos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
