<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <NuxtLink to="/admin">Bro World Admin</NuxtLink>
      </div>
      <nav class="admin-nav">
        <NuxtLink to="/admin" class="admin-nav-link">Articles</NuxtLink>
        <NuxtLink to="/admin/posts/new" class="admin-nav-link">Nouvel article</NuxtLink>
      </nav>
      <button class="logout-button" type="button" @click="logout">Déconnexion</button>
    </aside>
    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const token = useCookie<string | null>('admin_token')

const logout = () => {
  token.value = null
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 260px 1fr;
  background-color: #f5f5f5;
}

.admin-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  background-color: #121212;
  color: #fdfdfd;
}

.admin-brand a {
  font-weight: 700;
  font-size: 1.25rem;
  color: inherit;
  text-decoration: none;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin-nav-link {
  color: #fdfdfd;
  text-decoration: none;
  font-weight: 500;
}

.admin-nav-link.router-link-active {
  color: #61dafb;
}

.logout-button {
  margin-top: auto;
  padding: 0.75rem 1rem;
  background-color: #f04438;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
}

.logout-button:hover {
  background-color: #d92d20;
}

.admin-content {
  padding: 2.5rem 3rem;
  background-color: #ffffff;
}
</style>
