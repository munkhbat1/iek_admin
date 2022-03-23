import Link from "next/link"
import { useRouter } from "next/router";
import { FC } from "react"

export const SideNavItem: FC<SideNavItemProps> = ({ text, href }) => {
  const router = useRouter();
  const active = router.pathname === href ? 'bg-slate-500 text-white' : ''
  return (
    <div className="text-gray-500">
      <Link href={href}>
        <a className={`block py-2 text-lg hover:bg-slate-400 hover:text-white px-2 rounded mx-5 my-2 ${active}`}>
          {text}
        </a>
      </Link>
    </div>
  )
}

type SideNavItemProps = {
  text: string
  href: string
}