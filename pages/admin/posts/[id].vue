<template>
  <section>
    <header class="page-header">
      <div>
        <h1>Modifier l'article</h1>
        <p class="page-description">
          Mettez à jour le contenu de votre article puis sauvegardez vos changements.
        </p>
      </div>
      <NuxtLink to="/admin" class="secondary-button">Retour à la liste</NuxtLink>
    </header>

    <div v-if="pending" class="state-message">Chargement de l'article…</div>
    <div v-else-if="error" class="state-message error">Une erreur est survenue : {{ error.message }}</div>

    <form v-else class="form-card" @submit="onSubmit">
      <fieldset :disabled="isSubmitting" class="form-grid">
        <label>
          <span>Titre</span>
          <input v-model="values.title" type="text" required placeholder="Titre de l'article" />
          <small v-if="errors.title" class="error">{{ errors.title }}</small>
        </label>

        <label>
          <span>Slug</span>
          <input v-model="values.slug" type="text" placeholder="slug-personnalise" />
          <small class="helper">Laissez vide pour garder ou générer un slug automatiquement.</small>
        </label>

        <label class="full-width">
          <span>Contenu</span>
          <textarea v-model="values.content" rows="10" required placeholder="Contenu de l'article"></textarea>
          <small v-if="errors.content" class="error">{{ errors.content }}</small>
        </label>

        <label>
          <span>Statut</span>
          <select v-model="values.status">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </label>
      </fieldset>

      <div class="form-actions">
        <button class="primary-button" type="submit">
          {{ isSubmitting ? 'Enregistrement…' : 'Mettre à jour l\'article' }}
        </button>
      </div>

      <p v-if="submitError" class="state-message error">{{ submitError }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
interface AdminPostPayload {
  title: string
  slug?: string | null
  content: string
  status: string
}

interface AdminPost extends AdminPostPayload {
  id: number | string
}

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const route = useRoute()
const router = useRouter()
const { adminUseFetch, adminFetch } = useAdminApi()
const submitError = ref<string | null>(null)
const isFormInitialized = ref(false)

const { data, pending, error } = await adminUseFetch<AdminPost>(`/admin/posts/${route.params.id}`)

const { values, errors, isSubmitting, handleSubmit, setFieldValue } = useForm<AdminPostPayload>({
  initialValues: {
    title: '',
    slug: '',
    content: '',
    status: 'draft'
  },
  validate: (payload) => ({
    title: payload.title ? null : 'Le titre est obligatoire.',
    content: payload.content ? null : 'Le contenu est obligatoire.'
  })
})

watch(
  () => data.value,
  (post) => {
    if (!post || isFormInitialized.value) {
      return
    }

    setFieldValue('title', post.title ?? '')
    setFieldValue('slug', post.slug ?? '')
    setFieldValue('content', post.content ?? '')
    setFieldValue('status', post.status ?? 'draft')
    isFormInitialized.value = true
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (formValues) => {
  submitError.value = null

  try {
    await adminFetch(`/admin/posts/${route.params.id}`, {
      method: 'PUT',
      body: formValues
    })
    router.push('/admin')
  } catch (err) {
    console.error(err)
    submitError.value = 'Impossible de mettre à jour cet article. Réessayez plus tard.'
  }
})
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

.form-card {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  border: none;
  margin: 0;
  padding: 0;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
}

label span {
  font-size: 0.95rem;
  color: #1f2937;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  background-color: #fff;
}

textarea {
  resize: vertical;
}

.helper {
  font-weight: 400;
  color: #6b7280;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.primary-button,
.secondary-button {
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

.error {
  color: #b91c1c;
  font-weight: 500;
}

.state-message {
  margin-top: 1.5rem;
  color: #4b5563;
}

.state-message.error {
  color: #b91c1c;
}
</style>
