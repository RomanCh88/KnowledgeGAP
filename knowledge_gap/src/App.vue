<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">Knowledge GAP</h1>
      <p class="app-subtitle">Understanding Information Manipulation</p>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>A game demonstrating how gaps in knowledge affect our perception of reality</p>
    </footer>
  </div>
</template>

<style>
/* Reset and base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  color: #333;
  background-color: #f9f9f9;
  line-height: 1.6;
}

/* App container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.app-header {
  background-color: #3f51b5;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}

.app-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.app-subtitle {
  font-size: 1rem;
  opacity: 0.8;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  max-width: 100%;
  overflow-x: hidden;
}

/* Footer */
.app-footer {
  background-color: #f0f0f0;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .main-content {
    padding: 1rem 0.5rem;
  }
}
</style>
