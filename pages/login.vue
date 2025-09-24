<template>
  <section class="login-page">
    <div class="login-card">
      <NuxtLink to="/" class="back-link">← Retour au site</NuxtLink>
      <h1>Connexion administrateur</h1>
      <p class="intro">Accédez à l'espace d'administration du blog Bro World.</p>

      <form class="login-form" @submit="onSubmit">
        <div class="form-field">
          <label for="email">Adresse e-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            autocomplete="email"
            :value="values.email"
            :disabled="isSubmitting"
            @input="setFieldValue('email', ($event.target as HTMLInputElement).value)"
            required
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <div class="form-field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            name="password"
            autocomplete="current-password"
            :value="values.password"
            :disabled="isSubmitting"
            @input="setFieldValue('password', ($event.target as HTMLInputElement).value)"
            required
          />
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <p v-if="formError" class="form-message error">{{ formError }}</p>

        <button class="submit-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
interface LoginValues {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

const { adminFetch } = useAdminApi()
const adminToken = useCookie<string | null>('admin_token')
const formError = ref<string | null>(null)

const { values, errors, isSubmitting, setFieldValue, handleSubmit } = useForm<LoginValues>({
  initialValues: {
    email: '',
    password: ''
  },
  validate: (formValues) => {
    const validationErrors: Partial<Record<keyof LoginValues, string | null>> = {}

    if (!formValues.email?.trim()) {
      validationErrors.email = 'L\'adresse e-mail est requise.'
    }

    if (!formValues.password) {
      validationErrors.password = 'Le mot de passe est requis.'
    }

    return validationErrors
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  formError.value = null

  try {
    const response = await adminFetch<LoginResponse>('/admin/login', {
      method: 'POST',
      body: formValues
    })

    if (!response?.token) {
      throw new Error("Le serveur n'a pas renvoyé de jeton de connexion.")
    }

    adminToken.value = response.token
    await navigateTo('/admin')
  } catch (error: unknown) {
    console.error(error)

    if (typeof error === 'object' && error && 'data' in error) {
      const fetchError = error as { data?: { message?: string }; message?: string }
      formError.value = fetchError.data?.message || fetchError.message || 'Connexion impossible. Vérifiez vos identifiants.'
    } else if (error instanceof Error) {
      formError.value = error.message
    } else {
      formError.value = 'Connexion impossible. Vérifiez vos identifiants.'
    }
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(145deg, #0f172a, #1e293b);
}

.login-card {
  width: min(420px, 100%);
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.back-link {
  align-self: flex-start;
  font-size: 0.875rem;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #111827;
}

h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #0f172a;
}

.intro {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #0f172a;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5f5;
  background-color: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.field-error {
  margin: 0;
  font-size: 0.875rem;
  color: #dc2626;
}

.form-message {
  margin: 0;
  font-size: 0.95rem;
  text-align: center;
}

.form-message.error {
  color: #dc2626;
}

.submit-button {
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 9999px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 25px rgba(99, 102, 241, 0.35);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
