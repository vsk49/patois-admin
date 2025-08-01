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
    // Prepare payload
    const payload = identifier.value.includes('@')
      ? { email: identifier.value, motdepasse: password.value }
      : { nomutilisateur: identifier.value, motdepasse: password.value }

    const res = await fetch('http://localhost:3000/utilisateurs/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (res.ok && data.token) {
      localStorage.setItem('authToken', data.token)
      router.replace({ name: 'dashboard' }) // Make sure route name matches
    } else {
      errorMessage.value = data.error || (data.errors && data.errors.join(', ')) || 'Identifiants invalides'
    }
  } catch (e) {
    console.error(e)
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
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  max-width: 450px;
  width: 100%;
  padding: 40px 32px;
  background: var(--container-bg);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  position: relative;
}
.material-icons {
  font-size: 28px;
  color: var(--text);
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
  color: var(--text);
}
.subtitle {
  font-size: 18px;
  color: var(--subtitle);
  margin-bottom: 0;
}
.input-wrapper {
  width: 100%;
  background: var(--input-bg);
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
  color: var(--text);
  outline: none;
  border-radius: 12px;
}
.error-message {
  color: var(--primary);
  font-size: 14px;
  margin-top: 10px;
  width: 100%;
  text-align: left;
}
.login-btn {
  width: 100%;
  height: 60px;
  background: var(--primary);
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
  border-top: 2px solid var(--primary);
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