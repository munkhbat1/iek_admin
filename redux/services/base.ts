import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { JWT } from '../../types/AdminState'
import { logOut, refreshToken, selectAdmin } from '../slices/admin'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URI}`,
  prepareHeaders: (headers, {getState}) => {
    const token = selectAdmin(getState() as RootState).jwt?.access_token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
  credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin',
})

const baseQueryWithAuth =  async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery({
      url: '/admin/auth/refresh-token',
      method: 'POST',
      body: {
        refreshToken: selectAdmin(api.getState() as RootState).jwt?.refresh_token,
        fingerprintHash: selectAdmin(api.getState() as RootState).fingerprint,
      },
    }, api, extraOptions)

    if (refreshResult.data) {
      // store the new token
      api.dispatch(refreshToken(refreshResult.data as unknown as JWT))
      // retry the initial query
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }

  return result
}

export const baseApi = createApi({
  tagTypes: ['Product', 'ProductCategory', 'Blog', 'Order'],
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
})
