import { ProductCategory } from '../../types/ProductCategory'
import { ProductIndex, ProductListItem, UpdateProductData } from '../../types/ProductListItem'
import { baseApi } from './base'

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<void, FormData>({
      query: (fd) => ({
        url: '/products',
        method: 'POST',
        body: fd,
      }),
      invalidatesTags: [{type: 'Product', id: 'LIST'}]
    }),
    getProducts: builder.query<ProductIndex, string | string[] | undefined>({
      query: (page = '1') => `/products?page=${page}`,
      providesTags: [{type: 'Product', id: 'LIST'}]
    }),
    getProduct: builder.query<ProductListItem, string | string[] | undefined>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, arg) => {
        return [{ type: 'Product', id: result?.id }]
      },
    }),
    deleteProduct: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{type: 'Product', id: 'LIST'}],
    }),
    getAllProductCategories: builder.query<ProductCategory[], void>({
      query: () => '/products/categories',
      providesTags: [{type: 'ProductCategory', id: 'LIST'}],
    }),
    updateProduct: builder.mutation<void, UpdateProductData>({
      query: ({fd, id}) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: fd,
      }),
      invalidatesTags: (result, error, arg) => {
        return [{type: 'Product', id: 'LIST'}, {type: 'Product', id: arg.id}]
      },
    }),
  }),
})

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
  useGetAllProductCategoriesQuery,
  useUpdateProductMutation,
} = productApi