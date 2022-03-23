import { NextPage } from "next"
import Image from "next/image";
import { AdminAuth } from "../../../../components/AdminAuth"
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "easymde/dist/easymde.min.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { BlogFormData } from "../../../../types/BlogFormData";
import { useState, DragEvent, useRef, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { previewImage, createImageURLs, imageValidator } from "../../../../utils/imageUpload";
import { FiSend } from "react-icons/fi";
import { useGetBlogQuery, useUpdateBlogMutation } from "../../../../redux/services/blog";
import { FaSpinner } from "react-icons/fa";
import { Modal } from "../../../../components/Modals/Modal";
import { useRouter } from "next/router";
import { Loading } from "../../../../components/Loading";

const NewBlog: NextPage = () => {
  const router = useRouter()
  let { id } = router.query
  const { data, isLoading: isGetLoading, isSuccess: isGetSuccess } = useGetBlogQuery(id)

  const { register, handleSubmit: onSubmit, formState: { errors }, reset } = useForm<BlogFormData>()
  const [blogBody, setBlogBody] = useState("");
  const [dropDepth, setDropDepth] = useState(0)
  const [isDragEntered, setIsDragEntered] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [imagesError, setImagesError] = useState('')
  const [blogError, setBlogError] = useState('')
  const [previewImages, setPreviewImages] = useState<previewImage[]>([])
  const [images, setImages] = useState<File[]>()
  const imageSelectInput = useRef<HTMLInputElement>(null)

  const [updateBlog, { isError, isSuccess, isLoading}] = useUpdateBlogMutation()

  useEffect(() => {
    if (isGetSuccess && data) {
      setBlogBody(data.blog_body)
      reset({title: data.title, video_link: data.video_link, blog_body: data.blog_body, type: data.type})
      if (data.image) {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${data.image}`)
        .then(res => res.blob())
        .then(res => {
          const file = new File([res], data.image || 'image_name', { type: res.type })
          const filelist: File[] = [file]
          setImages(filelist);
          setPreviewImages(createImageURLs({ files: filelist }))
        })
      }
    }
  }, [data?.blog_body, data?.image, isGetSuccess, reset, data?.title, data?.video_link, data?.type])

  const handleSubmit: SubmitHandler<BlogFormData> = (data) => {
    if (images?.length === 0 && data.video_link.length === 0) {
      setSubmitError('Зураг эсвэл бичлэгний линк оруулна уу.')
      return
    } else { setSubmitError('') }
    if ((images && images?.length > 0) && data.video_link.length > 0) {
      setSubmitError('Зураг эсвэл бичлэгний линкийн аль нэгийг оруулна уу.')
      return
    } else { setSubmitError('') }

    if (blogBody.length === 0) {
      setBlogError('Бичвэрээ оруулна уу.')
      return
    } else { setBlogError('') }

    const fd = new FormData()

    if (images) {
      for (let i = 0; i < images.length; i++) {
        fd.append(`image`, images[i])
      }
    }
    fd.append('title', data.title)
    fd.append('video_link', data.video_link)
    fd.append('blog_body', blogBody)
    fd.append('type', data.type)

    updateBlog({
      fd: fd,
      id: parseInt(id?.toString() || '0'),
    })
  };

  const handleImages = (files: FileList) => {
    const [isValid, errorMessage] =imageValidator({ files })

    if (!isValid) {
      setImagesError(errorMessage)
      return
    }

    if (!(files.length <= 1)) {
      setImagesError('Зөвхөн нэг зураг оруулна уу.')
      return
    }

    setImagesError('')
    setImages(Array.from(files))
    setPreviewImages(createImageURLs({ files }))
  }

  const dragEnter= (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setDropDepth(val => val + 1)

    if (dropDepth === 1) {
      setIsDragEntered(true)
    }
  }

  const dragOver= (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    // only for drop preventDefault
    // from now use dragEnter
  }
  
  const drop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragEntered(false)
    setDropDepth(0)

    const dt = e.dataTransfer;
    const files = dt.files;
    handleImages(files)
  }

  const dragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()

    setDropDepth(val => val - 1)
    if (dropDepth === 1) {
      setIsDragEntered(false)
    }
  }

  const changeFiles = () => {
    if (imageSelectInput.current) {
      imageSelectInput.current.files && handleImages(imageSelectInput.current.files)
    }
  }

  const removeImage = (removedImage: previewImage) => {
    setPreviewImages(previewImages => {
      return previewImages.filter(previewImage => previewImage.name != removedImage.name)
    })

    setImages(images => {
      return images?.filter(image => image.name != removedImage.name)
    })
  }

  if (isGetLoading) {
    <Loading />
  }

  return (
    <>
      <form className="prose w-8/12 m-auto pt-3 z-50 relative flex flex-col" onSubmit={onSubmit(handleSubmit)}>
        <SimpleMDE value={blogBody} onChange={setBlogBody} />
        <div className="text-red-400 mb-4">{blogError}</div>
        <div>
          <input
            placeholder="Гарчиг"
            className="input w-full"
            { ...register('title', { required: 'Гарчиг оруулна уу.', }) } />
          <div className="text-red-400">{errors.title?.message}</div>
        </div>
        <div className="mt-4">
          <input
            placeholder="Youtube Бичлэгний линк"
            className="input w-full"
            { ...register('video_link') } />
        </div>

        {/* image upload */}
        <div className="bg-slate-300 flex items-center flex-col rounded-lg pb-12 mt-4">
          <div className="text-2xl font-semibold mt-14">
            Зураг оруулах
          </div>
          <div className="my-3 text-gray-500">
            Зөвшөөрөгдсөн өргөтгөлүүд /PNG, JPG, JPEG, BMP/
          </div>
          <div
            className={`
              border-[3px] border-gray-400 border-dashed w-11/12 rounded-lg my-4 bg-slate-200
              ${isDragEntered ? 'opacity-40' : ''}`}
              onDragEnter={dragEnter}
              onDragOver={dragOver}
              onDragLeave={dragLeave}
              onDrop={drop}
            >
              <div className="flex flex-col  items-center ">
                <AiOutlineCloudUpload className="text-9xl text-gray-600"/>
                <div className="my-3 text-gray-500">
                  <div>
                    <span>&quot;Drag and drop&quot; эсвэл </span>
                    <span className="underline decoration-sky-500 decoration-2 underline-offset-4 cursor-pointer" onClick={() => imageSelectInput.current && imageSelectInput.current.click()}>файл сонгох</span>
                  </div>
                  <input type="file" multiple accept=".png,.jpg,.jpeg,.bmp" className="hidden" ref={imageSelectInput} onChange={changeFiles}/>
                </div>
                <div className="text-red-400 mb-4">{imagesError}</div>
                <div className="grid gap-4 grid-cols-4 mb-4">
                  {previewImages.map(image =>
                    <div key={image.src}  className="flex flex-col">
                      <div className="relative w-52 h-40 cursor-pointer" onClick={() => removeImage(image)}>
                        <span className="absolute z-10 -right-1 -top-1">
                          <MdOutlineRemoveCircle className="bg-slate-200 rounded-full"/>
                        </span>
                        <Image src={image.src} alt='image preview' layout='fill' className="rounded brightness-50" onLoad={() => URL.revokeObjectURL(image.src)} />
                      </div>
                      <div className="self-center">{image.name}</div>
                    </div>)}
                </div>
              </div>
          </div>
        </div>
        <div className="flex items-center mt-3">
          <div className="mx-2 text-lg">Ангилал: </div>
          <select
            className="input"
            {...register("type", { required: 'Ангиллаа сонгоно уу.', })}>
            <option value="IEK_EDU">IEK-EDU</option>
            <option value="SALERS">Борлуулагч нар</option>
            <option value="BUSINESS_STRATEGY">Бизнес стратеги</option>
            <option value="COVID19">Ковид19</option>
          </select>
          <div className="text-red-400">{errors.type?.message}</div>
        </div>
        <div className="text-red-400 my-2 self-center">{submitError}</div>
        <button type="submit" className="flex justify-center max-w-fit self-center my-4">
          <div className="bg-red-500 flex items-center text-white justify-center px-4 py-2 rounded">
            {isLoading ?
              <FaSpinner className='animate-spin'/>
            : 
              <>
                <FiSend className="mr-2"/>
                <span>Илгээх</span>
              </>
            }
          </div>
        </button>
      </form>
      { isError
        &&
        <Modal contentMessage="Алдаа гарлаа." />
      }
      {
        isSuccess
        &&
        <Modal contentMessage="Амжилттай хадгаллаа." closeCallback={() => router.push('/admin/blogs')}/>
      }
    </>
  )
}

const NewBlogWithAuth = () => {
  return (
    <AdminAuth>
      <NewBlog />
    </AdminAuth>
  )
}
export default NewBlogWithAuth
