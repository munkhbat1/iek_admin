import { NextPage } from "next"
import { AdminAuth } from "../../../components/AdminAuth"
import { Loading } from "../../../components/Loading"
import { Error } from "../../../components/Error"
import { ProductCard } from "../../../components/ProductCard"
import { useGetProductsQuery } from "../../../redux/services/product"
import Link from "next/link"
import { useRouter } from "next/router"

const Products: NextPage = () => {
  const router = useRouter()
  let { page: pageParam } = router.query
  pageParam ||= '1'

  const { data, isLoading, isError, isSuccess } = useGetProductsQuery(pageParam)

  let pages: number[] = [];
  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  if (isSuccess && data) {
    for (let i = 0; i < data.total_pages; i++) {
      pages = [...pages, i];
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className='flex justify-center pt-6 flex-wrap gap-4'>
        {
          data?.items.map(product => {
            return <ProductCard images={product.images} name={product.name} remaining={product.remaining} price={product.price} key={product.id} id={product.id}/>
          })
        }
      </div>

      <div className="pagination mt-6 flex gap-4 flex-wrap">
        {
          pages.map(page => 
            <Link href={`products/?page=${page+1}`} key={page+1}>
              <a className={`px-4 py-2 bg-white shadow ${pageParam === (page+1).toString() ? 'text-white bg-black' : ''}`}>{page+1}</a>
            </Link>
          )
        }
      </div>
    </div>
  )
}

const ProductsWithAuth = () => {
  return (
    <AdminAuth>
      <Products />
    </AdminAuth>
  )
}
export default ProductsWithAuth
