<script setup>
import { ref, provide } from 'vue'
const navOpen = ref(true)
provide('navOpen', navOpen)
</script>

<template>
  <nav id="nav-bar" :class="{ 'collapsed': !navOpen }">
    <input id="nav-toggle" type="checkbox" v-model="navOpen" />
    <div id="nav-header">
      <slot name="header">
        <a id="nav-title" href="#">
          <slot name="brand">
            Nom de l'app
          </slot>
        </a>
      </slot>
      <label for="nav-toggle" id="burger-label">
        <span id="nav-toggle-burger"></span>
      </label>
    </div>
    <div id="nav-content">
      <slot name="nav">
        <RouterLink to="/dashboard" class="nav-button">
          <span class="material-icons nav-icon">home</span>
          <span class="nav-text">Accueil</span>
        </RouterLink>
        <RouterLink to="/mots" class="nav-button">
          <span class="material-icons nav-icon">translate</span>
          <span class="nav-text">Mots</span>
        </RouterLink>
        <RouterLink to="/phrases" class="nav-button">
          <span class="material-icons nav-icon">chat</span>
          <span class="nav-text">Phrases et Discussions</span>
        </RouterLink>
      </slot>
      <div id="nav-content-highlight"></div>
    </div>
    <div id="nav-footer-simple">
      <slot name="footer-avatar">
        <div id="nav-footer-avatar">
          <img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547" />
        </div>
      </slot>
      <slot name="footer-titlebox">
        <div id="nav-footer-titlebox">
          <a id="nav-footer-title" href="https://codepen.io/uahnbu/pens/public" target="_blank">uahnbu</a>
          <span id="nav-footer-subtitle">Admin</span>
        </div>
      </slot>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

#nav-bar {
  position: fixed;
  left: 1vw;
  top: 1vw;
  height: calc(100% - 2vw);
  background: #18283b;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  color: #f5f6fa;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: hidden;
  user-select: none;
  min-width: 80px;
  z-index: 10;
  transition: width 0.3s ease;
  width: 256px;
}

/* Collapsed state styles */
#nav-bar.collapsed {
  width: 80px;
}

#nav-bar.collapsed #nav-title {
  opacity: 0;
  pointer-events: none;
}

#nav-bar.collapsed .nav-text {
  opacity: 0;
  pointer-events: none;
}

#nav-bar.collapsed #nav-footer-titlebox {
  opacity: 0;
  pointer-events: none;
}

#nav-bar.collapsed #nav-toggle-burger::before {
  transform: translate(-2px, 8px) rotate(-30deg);
}

#nav-bar.collapsed #nav-toggle-burger::after {
  transform: translate(-2px, -8px) rotate(30deg);
}

#nav-bar hr {
  margin: 0;
  position: relative;
  left: 16px;
  width: calc(100% - 32px);
  border: none;
  border-top: solid 1px #2c3e50;
}

#nav-bar a {
  color: inherit;
  text-decoration: none;
}

#nav-bar input[type="checkbox"] {
  display: none;
}

#nav-header {
  position: relative;
  width: 100%;
  min-height: 80px;
  background: #18283b;
  border-radius: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  transition: width .2s;
}

#nav-title {
  font-size: 1.5rem;
  transition: opacity 0.3s;
  margin-left: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

#burger-label {
  position: absolute;
  right: 0;
  width: 3rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
}

#nav-toggle-burger {
  width: 28px;
  height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
}

#nav-toggle-burger,
#nav-toggle-burger span {
  box-sizing: border-box;
}

#nav-toggle-burger span,
#nav-toggle-burger::before,
#nav-toggle-burger::after {
  content: '';
  display: block;
  height: 4px;
  width: 100%;
  background: #f5f6fa;
  border-radius: 2px;
  transition: 0.3s;
  position: absolute;
  left: 0;
}

#nav-toggle-burger::before {
  top: 0;
}
#nav-toggle-burger::after {
  bottom: 0;
}
#nav-toggle-burger span {
  position: absolute;
  top: 9px;
  left: 0;
}

/* Animate burger to X when collapsed */
#nav-bar.collapsed #nav-toggle-burger::before {
  transform: translateY(9px) rotate(45deg);
}
#nav-bar.collapsed #nav-toggle-burger::after {
  transform: translateY(-9px) rotate(-45deg);
}
#nav-bar.collapsed #nav-toggle-burger span {
  opacity: 0;
}

#nav-content {
  margin: -16px 0;
  padding: 16px 0;
  position: relative;
  flex: 1;
  background: #18283b;
  box-shadow: 0 0 0 16px #18283b;
  direction: rtl;
  overflow-x: hidden;
  width: 100%;
}

#nav-content-highlight {
  /* Remove highlight effect */
  display: none;
}

.nav-button {
  position: relative;
  margin-left: 16px;
  height: 54px;
  display: flex;
  align-items: center;
  color: #8392a5;
  direction: ltr;
  cursor: pointer;
  z-index: 1;
  transition: color .2s, background .2s;
  font-size: 1rem;
  gap: 12px;
  border-radius: 16px; /* Add rounded corners */
}

.nav-text {
  transition: opacity 0.3s;
  white-space: nowrap;
}

.nav-icon {
  font-family: 'Material Icons';
  font-size: 1.6rem;
  color: #8392a5;
  min-width: 32px;
  text-align: center;
  display: inline-block;
  transition: color 0.2s;
}

/* Keep only hover effect for cursor */
.nav-button:hover {
  color: #f5f6fa;
  background: rgba(156, 136, 255, 0.16); /* Slightly more visible */
  border-radius: 16px; /* Ensure roundness on hover */
}
.nav-button:hover .nav-icon {
  color: #f5f6fa;
}

/* Simple footer styles */
#nav-footer-simple {
  width: 100%;
  background: #2c3e50;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 12px 0 12px 16px;
  gap: 12px;
  min-height: 54px;
  box-sizing: border-box;
  z-index: 2;
}

#nav-footer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
#nav-footer-avatar img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

#nav-footer-titlebox {
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s;
}

#nav-footer-title {
  font-size: 1rem;
  font-weight: bold;
}

#nav-footer-subtitle {
  color: #8392a5;
  font-size: .8rem;
}

@media (max-width: 600px) {
  #nav-bar, #nav-content, #nav-footer-simple {
    width: 100vw !important;
    min-width: 0 !important;
    left: 0 !important;
    border-radius: 0 !important;
  }
  #nav-header {
    width: 100vw !important;
    left: 0 !important;
    border-radius: 0 !important;
  }
}
</style>