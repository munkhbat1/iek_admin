import { FC } from 'react'
import { SideNavItem } from './SideNavItem'

export const Layout:FC = ({ children }) => {
  return (
    <div>
      <div className="h-full bg-black w-56 fixed z-10 overflow-x-hidden pt-4 hidden-scrollable">
        <SideNavItem text="Бүтээгдэхүүн нэмэх" href="/admin/products/new"/>
        <SideNavItem text="Бүтээгдэхүүнүүд" href="/admin/products"/>
        <SideNavItem text="Блог нэмэх" href="/admin/blogs/new"/>
        <SideNavItem text="Блогууд" href="/admin/blogs"/>
        <SideNavItem text="Захиалгууд" href="/admin/orders" />
        <SideNavItem text="Гарах" href="/admin/logout" />
      </div>
      <div className='ml-56'>
        {children}
      </div>
    </div>
  )
}