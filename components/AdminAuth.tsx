import { useRouter } from "next/router"
import { useAppSelector } from "../redux/hooks"
import { selectAdmin } from "../redux/slices/admin"
import { FC, useEffect } from "react"

export const AdminAuth: FC<AdminAuthProps> = ({children}) => {
  const router = useRouter()
  const admin = useAppSelector(selectAdmin)

  useEffect(() => {
    if (admin.status === 'loggedOut') {
      router.replace("/admin")
    }
  }, [admin, router])

  return children;
}

type AdminAuthProps = {
  children: JSX.Element,
}