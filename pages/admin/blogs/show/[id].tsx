import { NextPage } from "next"
import { AdminAuth } from "../../../../components/AdminAuth"
import { useRouter } from "next/router"
import { useDeleteProductMutation, useGetProductQuery } from "../../../../redux/services/product"
import { Loading } from "../../../../components/Loading"
import { Error } from "../../../../components/Error"
import Image from 'next/image'
import { useEffect, useState } from "react"
import { DeleteModal } from "../../../../components/Modals/DeleteModal"
import { useDeleteBlogMutation, useGetBlogQuery } from "../../../../redux/services/blog"
import * as marked from "marked"
import Link from "next/link"

const BlogDetail: NextPage = () => {
  const [videoId, setVideoId] = useState('')
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false)
  const router = useRouter()
  let { id } = router.query
  const { data, isLoading, isError, isSuccess } = useGetBlogQuery(id)

  const [deleteBlog, { isError: isDeleteError, isSuccess: isDeleteSuccess, isLoading: isDeleteLoading}] = useDeleteBlogMutation()

  useEffect(() => {
    if (data?.video_link) {
      const queryString = data.video_link.split('?')[1]
      const queryStringParams = new URLSearchParams(queryString)
      if (queryStringParams.has('v')) {
        setVideoId(queryStringParams.get('v') || '')
      }
    }
  }, [data])

  if (isLoading || isDeleteLoading) {
    return <Loading />
  }

  if (isDeleteSuccess) {
    router.push('/admin/blogs')
  }

  if (isError || isDeleteError) {
    return <Error />
  }
  return (
    <div className="flex flex-col pt-6 items-center">
      {/* Image or Video start */}
      <div className="items-center flex flex-col w-full">
        <div className="w-10/12 h-96 flex justify-center">
          {
            data?.image ? (
              <div className="relative w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${data.image}`}
                  alt='product image'
                  layout='fill'
                  objectFit="contain"
                  className="cursor-pointer" />
              </div>
            ) : (
              <iframe src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen={true} className="aspect-video"></iframe>
            ) 
          }
        </div>
      </div>
      {/* Image or Video end */}

      {/* Blog detail start */}
      <div className="prose ml-10 mt-4 flex flex-col items-center w-10/12">
        <h1>
          {data?.title}
        </h1>
        <h5 className="mb-2">
          {data?.type}
        </h5>
        <div dangerouslySetInnerHTML={ {__html: marked.parse(data?.blog_body || '')} }>
        </div>
      </div>
      {/* Blog detail end */}

      <div className="flex ml-10 mb-6 mt-3">
        <Link href={`/admin/blogs/edit/${id}`}>
          <a className="cursor-pointer px-5 py-2 bg-yellow-300">
            Засах
          </a>
        </Link>

        <button className="cursor-pointer px-5 py-2 ml-4 bg-red-500 text-white" onClick={() => setIsDeleteModalShown(true)}>
          Устгах
        </button>

        <DeleteModal contentMessage="Та энэ блогийг устгах уу?" okCallBack={() => deleteBlog(data?.id)} isShown={isDeleteModalShown} noCallBack={() => setIsDeleteModalShown(false)}/>
      </div>
    </div>
  )
}

const BlogDetailWithAuth = () => {
  return (
    <AdminAuth>
      <BlogDetail />
    </AdminAuth>
  )
}
export default BlogDetailWithAuth
