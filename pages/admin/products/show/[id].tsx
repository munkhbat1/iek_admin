import { NextPage } from "next"
import { AdminAuth } from "../../../../components/AdminAuth"
import { useRouter } from "next/router"
import { useDeleteProductMutation, useGetProductQuery } from "../../../../redux/services/product"
import { Loading } from "../../../../components/Loading"
import { Error } from "../../../../components/Error"
import Image from 'next/image'
import { useEffect, useState } from "react"
import { DeleteModal } from "../../../../components/Modals/DeleteModal"
import Link from "next/link"

const ProductDetail: NextPage = () => {
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false)
  const router = useRouter()
  let { id } = router.query
  const { data, isLoading, isError, isSuccess } = useGetProductQuery(id)
  const [currentImage, setCurrentImage] = useState<string>()

  const [deleteProduct, { isError: isDeleteError, isSuccess: isDeleteSuccess, isLoading: isDeleteLoading}] = useDeleteProductMutation()

  useEffect(() => {
    setCurrentImage(data?.images[0])
  }, [isSuccess, data?.images])

  if (isLoading || isDeleteLoading) {
    return <Loading />
  }


  if (isDeleteSuccess) {
    router.push('/admin/products')
  }

  if (isError || isDeleteError) {
    return <Error />
  }


  const changeCurrentImage = (imageSrc: string) => setCurrentImage(imageSrc)

  return (
    <div className="flex flex-col pt-6">
      {/* Image start */}
      <div className="items-center flex flex-col">
        <div className="w-10/12 h-96 flex justify-center">
          <div className="relative w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${currentImage}`}
              alt='product image'
              layout='fill'
              objectFit="contain"
              className="cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-2">
          {data?.images.map(image =>
              <div className="relative w-48 h-40 border-2 hover:brightness-50" key={image} onClick={() => changeCurrentImage(image)}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${image}`}
                  alt='product image'
                  layout='fill'
                  className="cursor-pointer" />
              </div>
          )}
        </div>
      </div>
      {/* Image end */}

      {/* Product detail start */}
      <div className="ml-10 mt-4">
        <div className="flex items-center shadow px-3 py-3 rounded">
          <div className="font-bold text-2xl">{data?.name}</div>
          <div className="text-xl text-gray-600 ml-5">{data?.price.toLocaleString()}&#8366;</div>
          <div className="ml-3 text-lg">Үлдэгдэл: {data?.remaining}</div>
          <div className="ml-3 text-lg">Категори: {data?.category.value}</div>
          <div className="ml-3 text-lg">Төрөл: {data?.type === 'SPECIAL' ? 'Онцлох' : 'Энгийн'}</div>
        </div>
        <div>
          <div className="text-xl mb-2 mt-5 px-2 font-semibold">Шаардлагууд</div>
          <div>
            {
              data?.requirements.map((requirement, index) => 
                <div className="bg-slate-200 pl-4 py-2 text-xl rounded-md my-2" key={index}>
                  {requirement}
                </div>
              )
            }
          </div>
        </div>
      </div>
      {/* Product detail end */}

      <div className="flex ml-10 mb-6 mt-3">
        <Link href={`/admin/products/edit/${id}`}>
          <a className="cursor-pointer px-5 py-2 bg-yellow-300">
            Засах
          </a>
        </Link>

        <button className="cursor-pointer px-5 py-2 ml-4 bg-red-500 text-white" onClick={() => setIsDeleteModalShown(true)}>
          Устгах
        </button>

        <DeleteModal contentMessage="Та энэ бүтээгдэхүүнийг устгах уу?" okCallBack={() => deleteProduct(data?.id)} isShown={isDeleteModalShown} noCallBack={() => setIsDeleteModalShown(false)}/>
      </div>
    </div>
  )
}

const ProductsWithAuth = () => {
  return (
    <AdminAuth>
      <ProductDetail />
    </AdminAuth>
  )
}
export default ProductsWithAuth
