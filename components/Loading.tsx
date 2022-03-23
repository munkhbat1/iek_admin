import { FaSpinner } from "react-icons/fa"

export const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <FaSpinner className='animate-spin text-3xl'/>
    </div>
  )
}