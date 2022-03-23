import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/admin')
  }, [router])

  return (
    <>
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
export default Home
