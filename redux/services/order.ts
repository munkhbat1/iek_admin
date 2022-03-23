import { OrderDetailIndex, OrderIndex } from '../../types/Order'
import { baseApi } from './base'

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderIndex, string | string[] | undefined>({
      query: (page = '1') => `/orders?page=${page}`,
      providesTags: [{type: 'Order', id: 'LIST'}]
    }),
    getOrderDetail: builder.query<OrderDetailIndex, string | string[] | undefined>({
      query: (id) => `/orders/details/${id}`,
      providesTags: (result, error, arg) => {
        return [{ type: 'Order', id: result?.order.id }]
      },
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderDetailQuery,
} = orderApi