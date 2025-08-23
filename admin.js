<script>
// === Firebase v8 já está no admin.html (firebase-app.js, firebase-auth.js, firebase-firestore.js) ===
// Este arquivo assume v8 (namespace "firebase"). NÃO use imports ESM aqui.

(function () {
  // ###### CONFIG DO SEU PROJETO (você me passou esses dados) ######
  var firebaseConfig = {
    apiKey: "AIzaSyAMf0Z5_a1DufNRCTHGPGC6ZBE9T2-tYAU",
    authDomain: "clube-aguiar-live.firebaseapp.com",
    projectId: "clube-aguiar-live",
    storageBucket: "clube-aguiar-live.firebasestorage.app",
    messagingSenderId: "694025911850",
    appId: "1:694025911850:web:5f0c6117dbc60b15118d53"
  };

  // UID do admin que você informou
  var ADMIN_UID = "Lklp9zwhhcSMgrWttuSiEk2D5I02";

  // Inicializa se ainda não estiver inicializado
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var auth = firebase.auth();
  var db   = firebase.firestore();

  // ---------- UI helpers ----------
  function qs(sel)   { return document.querySelector(sel); }
  function qsa(sel)  { return Array.from(document.querySelectorAll(sel)); }
  function setErr(el, msg){ el.textContent = msg || ""; el.style.display = msg ? "block":"none"; }
  function setOk(el, msg){ el.textContent = msg || ""; el.style.display = msg ? "block":"none"; }

  // Dá um “disabled” geral até logar
  function disableAll(disabled) {
    qsa("input, button, select, textarea").forEach(function(el){
      if (el.id === "btn-sair") return; // deixa sair sempre
      el.disabled = !!disabled;
    });
  }

  // Modal/Prompt simples para e-mail/senha
  async function promptCredentials() {
    const email = window.prompt("E-mail do admin:");
    if (!email) throw new Error("Login cancelado");
    const pass = window.prompt("Senha:");
    if (!pass) throw new Error("Login cancelado");
    await auth.signInWithEmailAndPassword(email, pass);
  }

  // Garante que está logado e que o UID é o do admin
  function ensureAdmin() {
    return new Promise(function(resolve, reject){
      auth.onAuthStateChanged(async function(user){
        const status = qs("#status-admin") || { textContent: "" };
        if (user) {
          status.textContent = "Logado como: " + (user.email || "(sem e-mail)") + " — UID: " + user.uid;
          if (user.uid !== ADMIN_UID) {
            await auth.signOut();
            alert("Esta conta não é admin. Faça login com o e-mail do admin.");
            try {
              await promptCredentials();
            } catch (e) {
              reject(e);
              return;
            }
            // volta — onAuthStateChanged dispara de novo
          } else {
            resolve(user);
          }
        } else {
          status.textContent = "Não logado";
          try {
            await promptCredentials();
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  // ---------- Lógica do Admin ----------
  async function main() {
    // Elementos da seção "Código do treino"
    var inpCode   = qs("#code-treino")    || qs('input[name="code"]') || document.querySelector("input[placeholder='foco']");
    var inpPoints = qs("#points-checkin") || document.querySelector("input[placeholder='3']");
    var btnSaveCode = qs("#btn-save-code") || (function(){
      // fallback por id / estrutura existente
      return qsa("button").find(b => /salvar código/i.test(b.textContent)) || null;
    })();
    var codeMsg = qs("#code-msg") || (function(){
      var el = document.createElement("div"); el.id = "code-msg"; el.className="err"; el.style.marginTop="8px";
      (btnSaveCode && btnSaveCode.parentElement || document.body).appendChild(el);
      return el;
    })();

    // Elementos da seção "Adicionar/editar atleta"
    var inpName   = qs("#athlete-name")   || qsa("input").find(i=>/nome/i.test(i.placeholder||i.previousSibling?.textContent||""));
    var inpPhoto  = qs("#athlete-photo")  || qsa("input").find(i=>/https?:\/\//i.test(i.placeholder||"") || /URL pública/i.test(i.parentElement?.textContent||""));
    var inpInit   = qs("#athlete-points") || qsa("input").find(i=>i.value==='0' || /pontos iniciais/i.test(i.parentElement?.textContent||""));
    var inpStatus = qs("#athlete-status") || qsa("input").find(i=>/status/i.test(i.placeholder||i.parentElement?.textContent||""));
    var inpBadges = qs("#athlete-badges") || qsa("input").find(i=>/emoji|selos/i.test(i.parentElement?.textContent||""));
    var btnSaveAth= qs("#btn-save-athlete") || qsa("button").find(b=>/salvar atleta/i.test(b.textContent));
    var athMsg    = qs("#ath-msg") || (function(){
      var el = document.createElement("div"); el.id="ath-msg"; el.className="err"; el.style.marginTop="8px";
      (btnSaveAth && btnSaveAth.parentElement || document.body).appendChild(el);
      return el;
    })();

    // Botão sair (opcional)
    var btnSair = qs("#btn-sair");
    if (!btnSair) {
      btnSair = document.createElement("button");
      btnSair.id="btn-sair";
      btnSair.textContent = "Sair";
      btnSair.className = "btn-sm";
      (document.querySelector("header") || document.body).appendChild(btnSair);
    }
    btnSair.addEventListener("click", function(){ auth.signOut(); });

    // Aguarda login admin
    disableAll(true);
    try {
      await ensureAdmin();
      disableAll(false);
    } catch (e) {
      alert("Não foi possível fazer login do admin: " + (e.message||e));
      return;
    }

    // ---- Ações: salvar código do treino do dia ----
    if (btnSaveCode && inpCode && inpPoints) {
      btnSaveCode.addEventListener("click", async function(){
        setErr(codeMsg, ""); setOk(codeMsg,"");
        try {
          var code = (inpCode.value||"").trim();
          var pts  = parseInt(inpPoints.value, 10) || 0;
          if (!code) throw new Error("Informe o código do treino (ex.: FOCO)");
          await db.collection("codes").doc("current").set({
            code: code.toUpperCase(),
            points: pts,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          setOk(codeMsg, "Código salvo ✓");
        } catch (e) {
          setErr(codeMsg, "Erro ao salvar código: " + (e.message||e));
        }
      });
    }

    // ---- Ações: criar/editar atleta (ranking) ----
    if (btnSaveAth && inpName) {
      btnSaveAth.addEventListener("click", async function(){
        setErr(athMsg, ""); setOk(athMsg,"");
        try {
          var name   = (inpName.value||"").trim();
          if (!name) throw new Error("Nome é obrigatório.");
          var id     = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
          var photo  = (inpPhoto && inpPhoto.value||"").trim() || null;
          var points = parseInt(inpInit && inpInit.value || "0", 10) || 0;
          var status = (inpStatus && inpStatus.value || "").trim();
          var badges = (inpBadges && inpBadges.value || "").trim();
          var badgesArr = badges ? badges.split(/\s+/).filter(Boolean) : [];

          await db.collection("ranking").doc(id).set({
            name, photoUrl: photo, points, status, badges: badgesArr,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          setOk(athMsg, "Atleta salva ✓");
        } catch (e) {
          setErr(athMsg, "Erro ao salvar atleta: " + (e.message||e));
        }
      });
    }

  } // end main

  // Inicia
  document.addEventListener("DOMContentLoaded", main);
})();
</script>
