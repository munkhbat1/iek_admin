import { FC, useRef } from "react"

export const DeleteModal: FC<DeleteModalProps> = ({ contentMessage, okCallBack, isShown, noCallBack}) => {

  const modalRef = useRef<HTMLDivElement>(null)
  const closeModal = () => {
    noCallBack()
  }


  return (
    <div ref={modalRef} className={`fixed z-50 pt-24 left-0 top-0 w-screen h-screen overflow-auto bg-[rgba(0,0,0,0.75)] flex justify-center items-center ${isShown ? '' : 'hidden'}`}>
      <div className="bg-white rounded">
        <div className="modal-content">
          <div className="px-5 py-3">
            {contentMessage}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <div className="modal-close mb-3" onClick={okCallBack || closeModal}>
            <div className="flex items-center justify-center">
              <div className="cursor-pointer bg-red-500 text-white px-4 py-1 rounded">
                Тийм
              </div>
            </div>
          </div>
          <div className="modal-close mb-3" onClick={closeModal}>
            <div className="flex items-center justify-center">
              <div className="cursor-pointer bg-slate-800 text-white px-4 py-1 rounded">
                Үгүй
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type DeleteModalProps = {
  contentMessage: string;
  okCallBack?: () => void;
  noCallBack: () => void;
  isShown: boolean;
}