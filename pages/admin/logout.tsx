import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAppDispatch } from "../../redux/hooks"
import { logOut } from "../../redux/slices/admin"

const Logout: NextPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()


  useEffect(() => {
    window.addEventListener('storage', logOutSyncAcrossTab(dispatch, router))
    dispatch(logOut())
    router.push('/admin')
    localStorage.setItem('logout', Date.now().toString())
  }, [dispatch, router])

  return (
    <>
    </>
  )
}

export default Logout

const logOutSyncAcrossTab = (dispatch: any, router: any) => (event: any) => {
  if (event.key === 'logout') {
    dispatch(logOut())
    router.push('/admin')
  }
}
