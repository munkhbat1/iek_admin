import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useLoginAdminMutation } from '../../redux/services/admin'
import { NextPageWithLayout } from '../_app'
import { FaSpinner } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { logIn, selectAdmin } from '../../redux/slices/admin'

const AdminLogin: NextPageWithLayout = () => {
  const [loginAdmin, {data: jwtAndFingerPrint, isError, isSuccess, isLoading}] = useLoginAdminMutation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const admin = useAppSelector(selectAdmin)

  const adminName = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    loginAdmin({
      name: adminName.current!.value,
      password: password.current!.value,
    })
  }

  if (isSuccess && jwtAndFingerPrint) {
    dispatch(logIn(jwtAndFingerPrint))
    router.push('/admin/products/new')
  }
  
  if (admin.status === 'loggedIn') {
    router.replace("/admin/products/new")
  }

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <div className='text-4xl mb-10'>Электромонтаж</div>
      <div className='text-red-400 mb-10 text-sm'>
        {isError && 'Алдаа гарлаа. Хэрэглэгчийн нэр нууц үгээ шалгана уу.'}
      </div>
      <div className='bg-slate-200 rounded flex flex-col py-4 px-6'>
        <label className='font-bold uppercase text-xs py-2'>Хэрэглэгчийн нэр</label>
        <input
          type="text"
          required
          className='bg-yellow-100 rounded px-3 py-2'
          ref={adminName} />
        <label className='font-bold uppercase text-xs py-2'>Нууц үг</label>
        <input
          type="password"
          required
          className='bg-yellow-100 rounded px-3 py-2'
          ref={password} />

        <button
          className='uppercase bg-slate-700 text-white my-5 font-bold py-3 rounded w-72 text-sm flex justify-center'
          onClick={isLoading ? () => null : handleLogin}
        >
          {isLoading ?
            <FaSpinner className='animate-spin'/>
          :
            <span>Нэвтрэх</span>
          }
        </button>
      </div>
    </div>
  )
}

AdminLogin.getLayout = function getLayout(page) {
  return (
    <>
      {page}
    </>
  )
}

export default AdminLogin
