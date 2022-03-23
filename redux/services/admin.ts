import { AdminLoginInfo } from '../../types/AdminLoginInfo'
import { AdminState } from '../../types/AdminState'
import { baseApi } from './base'

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<string, void>({
      query: () => '/admin/profile',
    }),
    loginAdmin: builder.mutation<AdminState, AdminLoginInfo>({
      query: ({name, password}) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: {
          name,
          password
        }
      }),
    }),
  }),
})

export const {
  useLoginAdminMutation,
  useGetProfileQuery,
} = adminApi