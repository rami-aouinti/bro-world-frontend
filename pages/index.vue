<template>
  <section class="landing">
    <div class="landing__content">
      <h1 class="landing__title">Welcome to Bro World</h1>
      <p class="landing__message">Redirecting you to the login page...</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: () => navigateTo('/login')
});
</script>

<style scoped>
.landing {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.landing__title {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}

.landing__message {
  font-size: 1.125rem;
  color: #4b5563;
}
</style>
