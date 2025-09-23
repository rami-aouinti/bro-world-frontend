import { reactive, ref } from 'vue'

type SubmitHandler<T> = (values: T) => Promise<void> | void

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string | null>>
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const values = reactive({ ...options.initialValues }) as T
  const errors = reactive<Record<string, string | null>>({})
  const isSubmitting = ref(false)

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    values[field] = value
  }

  const resetForm = () => {
    Object.assign(values, options.initialValues)
    Object.keys(errors).forEach((key) => {
      errors[key] = null
    })
  }

  const validate = () => {
    if (!options.validate) {
      return true
    }

    const result = options.validate(values)
    let isValid = true

    Object.entries(result).forEach(([key, message]) => {
      errors[key] = message ?? null
      if (message) {
        isValid = false
      }
    })

    return isValid
  }

  const handleSubmit = (handler: SubmitHandler<T>) => {
    return async (event?: Event) => {
      event?.preventDefault()

      if (!validate()) {
        return
      }

      try {
        isSubmitting.value = true
        await handler({ ...values })
      } finally {
        isSubmitting.value = false
      }
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    resetForm,
    validate,
    handleSubmit
  }
}
