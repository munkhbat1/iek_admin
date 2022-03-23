import { NextPage } from "next"
import { AdminAuth } from "../../../components/AdminAuth"
import { Loading } from "../../../components/Loading"
import { Error } from "../../../components/Error"
import { useRouter } from "next/router"
import { useGetOrdersQuery } from "../../../redux/services/order"
import Link from "next/link"

const Orders: NextPage = () => {
  const router = useRouter()
  let { page: pageParam } = router.query
  pageParam ||= '1'
  const { data, isLoading, isError, isSuccess } = useGetOrdersQuery(pageParam);

  let pages: number[] = [];

  if (isSuccess && data) {
    for (let i = 0; i < data.total_pages; i++) {
      pages = [...pages, i];
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-left border-2 mt-6 rounded-xl mx-4">
        <table className="">
          <thead className="border-b-2 border-neutral-500 h-10">
            <tr className="">
              <th className="w-9 text-center border-r-2 py-2">ID</th>
              <th className="border-r-2 px-2">Статус</th>
              <th className="border-r-2 px-2">Нэхэмжлэл үүсгэсэн хэрэглэгчийн ID</th>
              <th className="border-r-2 px-2">Нэхэмжлэлийн ID</th>
              <th className="border-r-2 px-2">Шинэчлэгдсэн хугацаа</th>
              <th className="px-2">Үүссэн хугацаа</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.items.map(order => {
                return (
                  <tr key={order.id} className='border-b-2 hover:bg-slate-500 cursor-pointer' onClick={() => router.push(`/admin/orders/show/${order.id}`)}>
                    <td className="text-center border-r-2 py-2">{order.id}</td>
                    <td className="border-r-2 px-2">{OrderStatus[order.status]}</td>
                    <td className="border-r-2 px-2">{order.user_id}</td>
                    <td className="border-r-2 px-2">{order.invoice_id}</td>
                    <td className="border-r-2 px-2">{`${order.updatedAt.split('T')[0]} ${order.updatedAt.split('T')[1].split('.')[0]}`}</td>
                    <td className="px-2">{`${order.createdAt.split('T')[0]} ${order.createdAt.split('T')[1].split('.')[0]}`}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <div className="pagination mt-6 flex gap-4 flex-wrap">
        {
          pages.map(page => 
            <Link href={`orders/?page=${page+1}`} key={page+1}>
              <a className={`px-4 py-2 bg-white shadow ${pageParam === (page+1).toString() ? 'text-white bg-black' : ''}`}>{page+1}</a>
            </Link>
          )
        }
      </div>
    </div>
  )
}

const OrdersWithAuth = () => {
  return (
    <AdminAuth>
      <Orders />
    </AdminAuth>
  )
}
export default OrdersWithAuth

export enum OrderStatus {
  NEW = 'Нэхэмжлэл үүссэн',
  FAILED = 'Бүтэлгүйтсэн',
  PAID = 'Төлөгдсөн',
  REFUNDED = 'Төлбөр буцаагдсан',
}
