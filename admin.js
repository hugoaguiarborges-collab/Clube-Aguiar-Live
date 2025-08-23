<script type="module">
// ==============================
// admin.js — Clube Aguiar (painel)
// ==============================

// Importes do Firebase (ES Modules via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// -----------------------------------------
// 1) Config do Firebase (seus dados)
// -----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
  authDomain: "clube-aguiar-live.firebaseapp.com",
  projectId: "clube-aguiar-live",
  storageBucket: "clube-aguiar-live.firebasestorage.app",
  messagingSenderId: "694025911850",
  appId: "1:694025911850:web:5f0c6117dbc60b15118d53",
};

// -----------------------------------------
// 2) Inicialização
// -----------------------------------------
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Expor globalmente (para outros scripts da página)
window.firebaseApp = app;
window.auth = auth;
window.db   = db;

// -----------------------------------------
// 3) Credenciais do Admin (login automático)
// -----------------------------------------
const ADMIN_EMAIL = "clubeenvelhecerbem@gmail.com";
const ADMIN_PASS  = "112233hugo";

// Utilitário: desabilita/habilita UI até logar
function setUIEnabled(enabled) {
  const controls = document.querySelectorAll("button, input, select, textarea");
  controls.forEach(el => {
    // Não travar campos de leitura, só ações
    if (el.type === "button" || el.type === "submit" || el.tagName === "BUTTON") {
      el.disabled = !enabled;
    }
  });

  const banner = document.getElementById("admin-status") || document.querySelector("[data-admin-status]");
  if (banner) {
    banner.textContent = enabled ? "Admin autenticado. Você pode usar o painel." : "Autenticando admin...";
    banner.style.color = enabled ? "#7CFC00" : "#ffd166";
  }
}

// Começa travado até autenticar
document.addEventListener("DOMContentLoaded", () => setUIEnabled(false));

// -----------------------------------------
// 4) Fluxo de Autenticação
// -----------------------------------------
onAuthStateChanged(auth, async (user) => {
  try {
    if (!user) {
      // Login automático do admin
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
      console.log("[admin] login automático OK");
    } else {
      console.log("[admin] já logado como:", user.email, "UID:", user.uid);
    }
    setUIEnabled(true);
    // Sinal para outros scripts que dependem do login
    window.dispatchEvent(new CustomEvent("admin-ready", { detail: { user: auth.currentUser } }));
  } catch (err) {
    console.error("[admin] falha ao autenticar:", err);
    setUIEnabled(false);
    alert("Erro ao autenticar admin: " + (err?.message || err));
  }
});

// (Opcional) Expor uma função de logout para colocar em um botão "Sair"
window.adminLogout = async () => {
  try {
    await signOut(auth);
    setUIEnabled(false);
    alert("Você saiu. Recarregue para entrar novamente.");
  } catch (e) {
    console.error("Erro ao sair:", e);
    alert("Erro ao sair: " + e.message);
  }
};

// -----------------------------------------
// 5) Aviso importante sobre as REGRAS
// -----------------------------------------
// Para não aparecer 'permission-denied', confirme nas Regras do Firestore:
// - O UID do admin (da conta acima) está listado na função isAdmin().
// - 'codes' e 'ranking' têm allow write: if isAdmin();
// - 'checkins' permite allow create com os campos esperados.
//
// Exemplo (resumo):
// function isAdmin() { return request.auth != null && request.auth.uid in ["SEU_UID_AQUI"]; }
// match /codes/{doc}   { allow read: if true; allow write: if isAdmin(); }
// match /ranking/{doc} { allow read: if true; allow write: if isAdmin(); }
// match /checkins/{doc} {
//   allow create: if request.resource.data.keys().hasOnly(['name','userId','code','points','createdAt']) &&
//                 request.resource.data.name is string &&
//                 request.resource.data.userId is string &&
//                 request.resource.data.code is string &&
//                 request.resource.data.points is int &&
//                 request.resource.data.createdAt is timestamp;
//   allow read: if true;
//   allow update, delete: if false;
// }
</script>
