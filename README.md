# Desafio 40+ — Ranking Gamificado

Este repositório contém os arquivos necessários para colocar no ar o seu **jogo de ranking** para o desafio das mulheres 40+. Com ele, você terá:

- Um **site público** (`index.html`) onde todas as alunas acompanham, em tempo real, a pontuação, posição, status e selos.
- Um **painel administrativo** (`admin.html`) onde apenas você (ou quem tiver a senha) consegue cadastrar atletas, dar pontos, atualizar status, atribuir/remover selos e “congelar” o ranking.
- As **regras de segurança** do Firestore (`firestore.rules`) para que qualquer pessoa possa ler o ranking, mas apenas o admin possa alterar.
- Um arquivo opcional (`sample_data.json`) com exemplo de atletas, caso queira importar dados iniciais.

> 💡 **Importante:** Você precisará criar um projeto no Firebase e hospedar estes arquivos em algum serviço (por exemplo, Vercel) para que o ranking funcione. Os passos a seguir explicam tudo.

## 📋 Passo a passo

### 1. Crie seu projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em **Add project** (Adicionar projeto).
2. Dê um nome para seu projeto (ex.: `desafio-40-mais`) e finalize.
3. No menu esquerdo:
   - Em **Firestore Database**, clique em **Create database** e escolha a localidade sugerida. Selecione o modo **Production**.  
   - Em **Authentication**, clique em **Get started** e ative o método **Email/Password**.
4. Ainda em **Authentication → Users**, clique em **Add user** e crie o usuário administrador com seu e‑mail e uma senha. **Guarde o UID** que aparecer (iremos usar nas regras).

### 2. Copie a configuração do Firebase

1. Em **Project settings (⚙️) → General → Your apps**, clique no ícone **</>** para adicionar um app web.
2. Dê um nome (ex.: `rank-web`) e marque **Use a CDN**.
3. O Firebase mostrará um objeto `const firebaseConfig = { ... }`.  
   Copie todos os campos (`apiKey`, `authDomain`, `projectId`, etc.).

### 3. Edite `index.html` e `admin.html`

1. Abra os arquivos `index.html` e `admin.html` em um editor de texto.
2. Procure pelo trecho:
   ```js
   const firebaseConfig = {
     apiKey: "COLE_AQUI_SEU_API_KEY",
     authDomain: "COLE_AQUI_SEU_AUTH_DOMAIN",
     projectId: "COLE_AQUI_SEU_PROJECT_ID",
     storageBucket: "COLE_AQUI_SEU_BUCKET",
     messagingSenderId: "COLE_AQUI_SEU_MESSAGING_SENDER_ID",
     appId: "COLE_AQUI_SEU_APP_ID"
   };
   ```
3. Substitua cada campo pelos valores copiados no passo anterior.

### 4. Defina as regras de segurança

1. Em **Firestore Database → Rules**, apague o conteúdo padrão.
2. Cole o conteúdo do arquivo `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /athletes/{athleteId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == "ADMIN_UID_AQUI";
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
3. Substitua `"ADMIN_UID_AQUI"` pelo UID do usuário criado no passo 1.4 e clique em **Publish**.

Com essas regras, qualquer pessoa poderá **ler** a coleção `athletes`, mas apenas o usuário com o UID informado poderá **escrever** nela.

### 5. Hospede os arquivos

1. Crie um repositório no GitHub (ou outra plataforma) e envie `index.html`, `admin.html` e este `README.md`.
2. Acesse [Vercel](https://vercel.com/) e faça login com sua conta GitHub.
3. Clique em **Add New → Project** e selecione seu repositório.
4. Em **Framework preset**, escolha **Other** (Nenhum).  
   Deixe os campos **Build Command** e **Output Directory** em branco.
5. Clique em **Deploy**. Após alguns segundos, você verá a URL do seu site.
   - O ranking estará em `https://SEU-SITE.vercel.app/index.html`.
   - O painel admin estará em `https://SEU-SITE.vercel.app/admin.html`.

> **Dica:** Se a raiz (`/`) mostrar 404, digite o caminho completo com `index.html` ou `admin.html`.

### 6. (Opcional) Importe dados iniciais

O arquivo `sample_data.json` contém um exemplo de atletas. Para importar:

1. No console do Firebase, vá em **Firestore → Data** e clique no menu de três pontinhos da coleção (ou use o botão "Import/Export").  
2. Importe o JSON para criar os documentos de exemplo, ou cadastre manualmente pelo `admin.html`.

### 7. Use no dia a dia

- Abra `admin.html` e faça login com o e‑mail e a senha do usuário criado.
- Cadastre novas atletas, ajuste pontos, status e selos.
- Clique em **Publicar ranking** sempre que quiser “congelar” as posições e atualizar a coluna 📈 (variação) no site público.
- Divulgue o link de `index.html` às alunas para que acompanhem as atualizações em tempo real.

## 🧠 Dicas finais

- **Selos** são emojis livres (🏅 Consistência, 🔥 Intensidade, 💧 Hidratação, ❤️ Superação...).  
- **Status** são palavras ou frases curtas (“Em alta”, “Constante”, “Retomando”…).
- Para **zerar** a pontuação de todas ao iniciar uma nova temporada, você pode editar cada atleta no painel admin ou adaptar o código para fazer isso de uma só vez.
- Se aparecer erro de permissão ao salvar, verifique se as regras do Firestore foram publicadas e se o UID do admin está correto.

Pronto! Com estes arquivos e o passo a passo acima, você terá um site de ranking ao vivo para motivar suas alunas. Divirta‑se! 🎉
