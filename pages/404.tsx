import { NextPageWithLayout } from "./_app"

const Page404: NextPageWithLayout = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      404 Not Found
    </div>
  )
}

Page404.getLayout = function getLayout(page) {
  return (
    <>
      {page}
    </>
  )
}

export default Page404