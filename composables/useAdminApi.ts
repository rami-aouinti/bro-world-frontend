import type { NitroFetchRequest } from 'nitropack'
import type { UseFetchOptions } from 'nuxt/app'

interface AdminFetchOptions<T> extends Omit<UseFetchOptions<T>, 'baseURL'> {
  headers?: HeadersInit
}

export function useAdminApi() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('admin_token')

  const getHeaders = (headers?: HeadersInit): Record<string, string> => {
    const result = new Headers(headers || {})

    if (token.value) {
      result.set('Authorization', `Bearer ${token.value}`)
    }

    return Object.fromEntries(result.entries())
  }

  const adminFetch = async <T>(request: NitroFetchRequest, options: (RequestInit & { body?: any }) = {}) => {
    return await $fetch<T>(request, {
      baseURL: config.public.adminApiBaseUrl,
      ...options,
      headers: getHeaders(options.headers as HeadersInit)
    })
  }

  const adminUseFetch = <T>(request: NitroFetchRequest, options: AdminFetchOptions<T> = {}) => {
    return useFetch<T>(request, {
      ...options,
      baseURL: config.public.adminApiBaseUrl,
      headers: getHeaders(options.headers)
    })
  }

  return { adminFetch, adminUseFetch }
}
