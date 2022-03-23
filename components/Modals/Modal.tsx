import { FC, useRef } from "react"

export const Modal: FC<ModalProps> = ({ contentMessage, closeMessage, closeCallback}) => {

  const modalRef = useRef<HTMLDivElement>(null)
  const closeModal = () => {
    if ( modalRef.current ) {
      modalRef.current.style.display = 'none'
    }
  }


  return (
    <div ref={modalRef} className="fixed z-50 pt-24 left-0 top-0 w-screen h-screen overflow-auto bg-[rgba(0,0,0,0.75)] flex justify-center items-center">
      <div className="bg-white rounded">
        <div className="modal-content">
          <div className="px-5 py-3">
            {contentMessage}
          </div>
        </div>

        <div className="modal-close mb-3" onClick={closeCallback || closeModal}>
          <div className="flex items-center justify-center">
            <div className="cursor-pointer bg-slate-800 text-white px-4 py-1 rounded">
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ModalProps = {
  contentMessage: string;
  closeMessage?: string;
  closeCallback?: () => void;
}