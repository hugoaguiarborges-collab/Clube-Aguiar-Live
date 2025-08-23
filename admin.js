<script type="module">
  // ===== Firebase v9 (modular) via CDN =====
  import {
    initializeApp,
    getApp,
    getApps,
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
  import {
    getFirestore,
    collection,
    getDocs,
  } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

  // ===== Helpers de UI (opcionais) =====
  function el(id) { return document.getElementById(id); }
  function showMsg(txt, isOk = true) {
    const box = el("pontuarMsgs");
    if (box) {
      box.style.whiteSpace = "pre-wrap";
      box.style.color = isOk ? "#00d37d" : "#ff6363";
      box.textContent = txt;
    }
    // sempre jogar no console também
    if (isOk) console.log(txt); else console.error(txt);
  }

  // ===== Config que você forneceu =====
  const firebaseConfig = {
    apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
    authDomain: "clube-aguiar-live.firebaseapp.com",
    projectId: "clube-aguiar-live",
    storageBucket: "clube-aguiar-live.firebasestorage.app",
    messagingSenderId: "694025911850",
    appId: "1:694025911850:web:5f0c6117dbc60b15118d53",
  };

  // UID do admin autorizado nas regras
  const ADMIN_UID = "Lklp9zwhhcSMgrWttuSiEk2D5I02";

  // ===== Inicialização segura (não duplicar app) =====
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // expor no window para debug (opcional)
  window.firebaseAdmin = { app, auth, db, signOut };

  // ===== Fluxo de login automático =====
  const ADMIN_EMAIL = "clubeenvelhecerbem@gmail.com";
  const ADMIN_PASS  = "112233hugo";

  async function ensureLogin() {
    try {
      // se já tem usuário, apenas retorna
      if (auth.currentUser) return auth.currentUser;

      // login automático
      const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
      return cred.user;
    } catch (err) {
      // erros comuns: auth/invalid-credential, auth/network-request-failed
      showMsg("❌ Erro no login do admin: " + err.code + " — " + err.message, false);
      throw err;
    }
  }

  // Observa o estado de auth e valida UID
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      showMsg("⋯ Efetuando login do admin…");
      try {
        const u = await ensureLogin(); // tenta logar
        validateUid(u);
      } catch (_) { /* já mostramos a msg no catch acima */ }
      return;
    }
    validateUid(user);
  });

  // valida se é mesmo o admin autorizado
  async function validateUid(user) {
    if (user.uid !== ADMIN_UID) {
      showMsg(
        "⚠️ Logado com UID diferente do admin permitido.\n" +
        "UID atual: " + user.uid + "\n" +
        "UID permitido nas regras: " + ADMIN_UID + "\n" +
        "Saindo… Faça login na conta correta.",
        false
      );
      try { await signOut(auth); } catch (_) {}
      return;
    }

    showMsg("✅ Admin logado.\nUID: " + user.uid);

    // Teste rápido de permissão: tentar LER a coleção "ranking"
    // (somente leitura é livre nas suas regras, mas valida conexão/config)
    try {
      await getDocs(collection(db, "ranking"));
      showMsg("🔎 Conexão Firestore OK. Você pode usar os botões do Admin.");
    } catch (err) {
      // se aparecer permission-denied aqui, há algo errado nas regras
      showMsg("❌ Falha ao ler Firestore (teste): " + err.code + " — " + err.message, false);
    }
  }
</script>
