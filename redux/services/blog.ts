import { UpdateBlogData } from '../../types/BlogFormData'
import { BlogIndex, BlogListItem } from '../../types/BlogListItem'
import { baseApi } from './base'

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation<void, FormData>({
      query: (fd) => ({
        url: '/blogs',
        method: 'POST',
        body: fd,
      }),
      invalidatesTags: [{type: 'Blog', id: 'LIST'}]
    }),
    getBlogs: builder.query<BlogIndex, string | string[] | undefined>({
      query: (page = '1') => `/blogs?page=${page}`,
      providesTags: [{type: 'Blog', id: 'LIST'}]
    }),
    getBlog: builder.query<BlogListItem, string | string[] | undefined>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, arg) => {
        return [{ type: 'Blog', id: result?.id }]
      },
    }),
    deleteBlog: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{type: 'Blog', id: 'LIST'}],
    }),
    updateBlog: builder.mutation<void, UpdateBlogData>({
      query: ({fd, id}) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body: fd,
      }),
      invalidatesTags: (result, error, arg) => {
        return [{type: 'Blog', id: 'LIST'}, {type: 'Blog', id: arg.id}]
      },
    }),
  }),
})

export const {
  useCreateBlogMutation,
  useGetBlogsQuery,
  useGetBlogQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} = blogApi