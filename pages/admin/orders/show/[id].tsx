import { NextPage } from "next"
import { useRouter } from "next/router"
import { AdminAuth } from "../../../../components/AdminAuth"
import { Loading } from "../../../../components/Loading"
import { useGetOrderDetailQuery } from "../../../../redux/services/order"
import { Error } from "../../../../components/Error"

const OrderDetail: NextPage = () => {
  const router = useRouter()
  let { id } = router.query
  const { data, isLoading, isError, isSuccess } = useGetOrderDetailQuery(id)

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2 mt-4">
      <div>{`Захиалагчийн нэр: ${data?.order.name}`}</div>
      <div>{`Захиалагчийн хаяг: ${data?.order.address}`}</div>
      <div>{`Захиалагчийн утас: ${data?.order.phone}`}</div>
      <div>{`Захиалагчийн төлсөн дүн: ${data?.order.amount}`}</div>
      </div>
      <div className="text-left border-2 mt-6 rounded-xl mx-4">
        <table className="">
          <thead className="border-b-2 border-neutral-500 h-10">
            <tr className="">
              <th className="w-9 text-center border-r-2 py-2">No</th>
              <th className="border-r-2 px-2">Бүтээгдэхүүний нэр</th>
              <th className="border-r-2 px-2">Нэгж үнэ</th>
              <th className="border-r-2 px-2">Тоо ширхэг</th>
              <th className="px-2">Шаардлага</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.orderDetails.map((orderDetail, idx) => {
                return (
                  <tr key={orderDetail.id} className='border-b-2 hover:bg-slate-500 cursor-pointer' onClick={() => router.push(`/admin/products/show/${orderDetail.productId}`)}>
                    <td className="text-center border-r-2 py-2">{idx + 1}</td>
                    <td className="border-r-2 px-2">{orderDetail.productName}</td>
                    <td className="border-r-2 px-2">{orderDetail.unitPrice.toLocaleString()} &#8366;</td>
                    <td className="border-r-2 px-2">{orderDetail.quantity}</td>
                    <td className="border-r-2 px-2">{orderDetail.requirement}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

const OrderDetailWithAuth = () => {
  return (
    <AdminAuth>
      <OrderDetail />
    </AdminAuth>
  )
}
export default OrderDetailWithAuth
