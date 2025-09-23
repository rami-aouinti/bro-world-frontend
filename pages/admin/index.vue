<template>
  <section>
    <header class="page-header">
      <div>
        <h1>Articles</h1>
        <p class="page-description">
          Gérez tous les articles publiés sur le blog Bro World.
        </p>
      </div>
      <NuxtLink to="/admin/posts/new" class="primary-button">Nouvel article</NuxtLink>
    </header>

    <div v-if="pending" class="state-message">Chargement des articles…</div>
    <div v-else-if="error" class="state-message error">Une erreur est survenue : {{ error.message }}</div>

    <table v-else class="posts-table">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Statut</th>
          <th>Créé le</th>
          <th>Mis à jour le</th>
          <th class="actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!posts?.length">
          <td colspan="5" class="state-message">Aucun article pour le moment.</td>
        </tr>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.title }}</td>
          <td class="status">{{ post.status ?? '—' }}</td>
          <td>{{ formatDate(post.createdAt) }}</td>
          <td>{{ formatDate(post.updatedAt) }}</td>
          <td class="actions-column">
            <NuxtLink :to="`/admin/posts/${post.id}`" class="secondary-button">Modifier</NuxtLink>
            <button
              class="danger-button"
              type="button"
              :disabled="isDeleting && deletingId === String(post.id)"
              @click="handleDelete(post.id)"
            >
              {{ isDeleting && deletingId === String(post.id) ? 'Suppression…' : 'Supprimer' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="deleteError" class="state-message error">{{ deleteError }}</p>
  </section>
</template>

<script setup lang="ts">
interface AdminPost {
  id: number | string
  title: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const { adminUseFetch, adminFetch } = useAdminApi()

const { data, pending, error, refresh } = await adminUseFetch<AdminPost[]>('/admin/posts', {
  default: () => []
})

const posts = computed(() => data.value ?? [])
const deleteError = ref<string | null>(null)
const isDeleting = ref(false)
const deletingId = ref<string | null>(null)

const formatDate = (value?: string) => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const handleDelete = async (postId: AdminPost['id']) => {
  if (!confirm('Voulez-vous vraiment supprimer cet article ?')) {
    return
  }

  deleteError.value = null
  isDeleting.value = true
  deletingId.value = String(postId)

  try {
    await adminFetch(`/admin/posts/${postId}`, { method: 'DELETE' })
    await refresh()
  } catch (err) {
    console.error(err)
    deleteError.value = 'Impossible de supprimer cet article. Réessayez plus tard.'
  } finally {
    isDeleting.value = false
    deletingId.value = null
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
}

.page-description {
  margin: 0.5rem 0 0;
  color: #6b7280;
}

.posts-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1);
}

.posts-table th,
.posts-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.posts-table tbody tr:last-child td {
  border-bottom: none;
}

.status {
  text-transform: capitalize;
}

.posts-table tbody .actions-column {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.posts-table thead .actions-column {
  text-align: right;
}

.primary-button,
.secondary-button,
.danger-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-button {
  background-color: #2563eb;
  color: #fff;
}

.primary-button:hover {
  background-color: #1d4ed8;
}

.secondary-button {
  background-color: #e0e7ff;
  color: #312e81;
}

.secondary-button:hover {
  background-color: #c7d2fe;
}

.danger-button {
  background-color: #fee2e2;
  color: #b91c1c;
}

.danger-button:hover {
  background-color: #fecaca;
}

.danger-button:disabled {
  background-color: #fca5a5;
  color: #7f1d1d;
  cursor: not-allowed;
}

.state-message {
  margin: 1.5rem 0;
  color: #4b5563;
}

.state-message.error {
  color: #b91c1c;
}
</style>
