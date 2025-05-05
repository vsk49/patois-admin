<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const identifier = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref(null)
const router = useRouter()

const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }
  isLoading.value = true
  errorMessage.value = null
  try {
    // Remplacez ceci par votre logique d'authentification réelle
    // Simule un succès si identifiant = "admin" et mot de passe = "admin"
    await new Promise(r => setTimeout(r, 1000))
    if (identifier.value.trim() === 'admin' && password.value === 'admin') {
      router.replace({ name: 'Dashboard' }) // Assurez-vous que la route existe
    } else {
      errorMessage.value = 'Identifiants invalides'
    }
  } catch (e) {
    errorMessage.value = 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-root">
    <div class="login-container">
      <div class="login-content">
        <h1>Connexion</h1>
        <p class="subtitle">Bienvenue | Benvegnu</p>
        <div class="spacer" style="height:60px"></div>
        <div class="input-wrapper">
          <input
            v-model="identifier"
            :disabled="isLoading"
            type="text"
            placeholder="Nom d'utilisateur ou adresse e-mail"
            @keyup.enter="handleLogin"
            class="login-input"
          />
        </div>
        <div class="spacer" style="height:20px"></div>
        <div class="input-wrapper">
          <input
            v-model="password"
            :disabled="isLoading"
            type="password"
            placeholder="Mot de passe"
            @keyup.enter="handleLogin"
            class="login-input"
          />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="spacer" style="height:5px"></div>
        <div class="spacer" style="height:30px"></div>
        <button
          class="login-btn"
          :disabled="isLoading"
          @click="handleLogin"
        >
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Connexion</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.login-root {
  min-height: 100vh;
  background: var(--background, #fafafa);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  max-width: 450px;
  width: 100%;
  padding: 40px 32px;
  background: var(--container-bg, #fff);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  position: relative;
}
.material-icons {
  font-size: 28px;
  color: #222;
}
.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #222;
}
.subtitle {
  font-size: 18px;
  color: #888;
  margin-bottom: 0;
}
.input-wrapper {
  width: 100%;
  background: #f3f3f3;
  border-radius: 12px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}
.login-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 18px;
  font-size: 16px;
  color: #222;
  outline: none;
  border-radius: 12px;
}
.error-message {
  color: #e53935;
  font-size: 14px;
  margin-top: 10px;
  width: 100%;
  text-align: left;
}
.login-btn {
  width: 100%;
  height: 60px;
  background: #e53935;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-btn:disabled {
  background: #f8bbbb;
  cursor: not-allowed;
}
.loader {
  border: 2px solid #fff;
  border-top: 2px solid #e53935;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.spacer {
  width: 100%;
}
</style>