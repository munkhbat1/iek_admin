import { NextPage } from "next"
import { AdminAuth } from "../../../../components/AdminAuth"
import { DragEvent, useEffect, useRef, useState } from "react"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { MdOutlineRemoveCircle } from "react-icons/md"
import { imageValidator, createImageURLs, previewImage } from "../../../../utils/imageUpload"
import Image from 'next/image'
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductDetailFormData } from "../../../../types/ProductDetailFormData";
import { Requirements } from "../../../../components/Requirements"
import { FiSend } from 'react-icons/fi'
import { useCreateProductMutation, useGetAllProductCategoriesQuery, useGetProductQuery, useUpdateProductMutation } from "../../../../redux/services/product"
import { FaSpinner } from "react-icons/fa"
import { useRouter } from "next/router"
import { Modal } from "../../../../components/Modals/Modal"
import { blob } from "node:stream/consumers"

const NewProduct: NextPage = () => {
  const router = useRouter()
  const imageSelectInput = useRef<HTMLInputElement>(null)
  const [isDragEntered, setIsDragEntered] = useState(false)
  const [dropDepth, setDropDepth] = useState(0)
  const [imagesError, setImagesError] = useState('')
  const [previewImages, setPreviewImages] = useState<previewImage[]>([])
  const [images, setImages] = useState<File[]>([])
  const {data: productCategories} = useGetAllProductCategoriesQuery()
  const { id } = router.query
  const { data, isLoading: isGetLoading, isSuccess: isGetSuccess } = useGetProductQuery(id)
  const [requirements, setRequirements] = useState<string[]>([])
  const [requirementsError, setRequirementsError] = useState('')

  const { register, handleSubmit: onSubmit, formState: { errors }, reset } = useForm<ProductDetailFormData>()

  const [updateProduct, { isError, isSuccess, isLoading}] = useUpdateProductMutation()

  useEffect(() => {
    if (isGetSuccess && data) {
      reset({name: data.name, category: data.category.key, price: data.price, remaining: data.remaining, type: data.type})
      setRequirements(data.requirements)

      const fetchData = async () => {
        let files: File[] = []
        if (data && data.images) {
          for (let i = 0; i < data.images.length; i++) {
            const imageName = data.images[i];
            const image = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${imageName}`)
            const imageBlob = await image.blob()
            const file = new File([imageBlob], imageName || 'image_name', { type: imageBlob.type })
            files = [...files, file];
          }
        }
        setImages(files);
        setPreviewImages(createImageURLs({ files: files }))
      }

      fetchData()
    }
  }, [data, isGetSuccess, reset])

  const handleImages = (files: FileList) => {
    const [isValid, errorMessage] =imageValidator({ files })

    if (!isValid) {
      setImagesError(errorMessage)
      return
    }
    setImagesError('')
    
    setImages(Array.from(files))
    setPreviewImages(createImageURLs({ files }))
  }

  const changeFiles = () => {
    if (imageSelectInput.current) {
      imageSelectInput.current.files && handleImages(imageSelectInput.current.files)
    }
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



  const handleSubmit: SubmitHandler<ProductDetailFormData> = (data) => {
    if (requirements.length === 0) {
      setRequirementsError('Шаардлагаа оруулна уу.')
      return
    }
    for (let i = 0; i < requirements.length; i++) {
      if (requirements[i].includes(',')) {
        setRequirementsError('Шаардлагад таслал оруулж болохгүй.')
        return
      }
    }

    if (!images || images.length === 0) {
      setImagesError('Зургаа оруулна уу.')
      return
    }

    const fd = new FormData()
    fd.append('name', data.name)
    fd.append('price', data.price?.toString() || '')
    fd.append('remaining', data.remaining?.toString() || '')
    fd.append('requirements', requirements.toString())
    fd.append('category', data.category)
    fd.append('type', data.type)

    for (let i = 0; i < images?.length; i++) {
      fd.append(`images`, images[i])
    }

    updateProduct({fd, id: parseInt(id?.toString() || '0')})

    setImagesError('')
    setRequirementsError('')
  }

  const removeImage = (removedImage: previewImage) => {
    setPreviewImages(previewImages => {
      return previewImages.filter(previewImage => previewImage.name != removedImage.name)
    })

    setImages(images => {
      return images?.filter(image => image.name != removedImage.name)
    })
  }

  return (
    <div className='py-8 flex flex-col justify-center items-center'>
      <form className="w-10/12" onSubmit={onSubmit(handleSubmit)}>
        <div className="bg-slate-300 flex items-center flex-col rounded-lg pb-12">
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
                        <Image src={image.src} alt='image preview' layout='fill' className="rounded brightness-50" onLoad={() => URL.revokeObjectURL(image.src)}/>
                      </div>
                      <div className="self-center">{image.name}</div>
                    </div>)}
                </div>
              </div>
          </div>
        </div>
        <div className="flex mt-8 flex-col">
          <div>
            <input
              placeholder="Нэр"
              className="input w-full"
              { ...register('name', { required: 'Бүтээгдэхүүний нэрийг оруулна уу.', }) } />
            <div className="text-red-400">{errors.name?.message}</div>
          </div>
          <div className="flex my-4">
            <div>
              <input
                placeholder="Үнэ"
                className="input input-number-no-arrow mr-8"
                { ...register('price',
                  {
                    required: 'Үнээ оруулна уу.',
                    validate: {
                      positive: v => {
                        if (v && parseInt(v.toString()) >= 0) return true
                        return 'Үнэ хэсэгт эерэг тоо оруулна уу.'
                      }
                    },
                    valueAsNumber: true,
                  })
                } />
                <div className="text-red-400">{errors.price?.message}</div>
            </div>
            <div>
              <input
                placeholder="Үлдэгдэл"
                className="input input-number-no-arrow mr-8"
                { ...register('remaining',
                  {
                    required: 'Үлдэгдлээ оруулна уу.',
                    validate: {
                      positive: v => {
                        if (v && parseInt(v.toString()) >= 0) return true
                        return 'Үнэ хэсэгт эерэг тоо оруулна уу.'
                      }
                    },
                    valueAsNumber: true,
                  })
                } />
              <div className="text-red-400">{errors.remaining?.message}</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <select
                className="input"
                {...register("category", { required: 'Ангиллаа оруулна уу.', })}>
                {
                  productCategories?.map(category => (
                    <option value={category.key} key={category.key}>{category.value}</option>
                  ))
                }
              </select>
              <div className="text-red-400">{errors.category?.message}</div>
            </div>
            <div>
              <select
                className="input"
                {...register("type", { required: 'Төрлөө сонгоно уу.', })}>
                <option value="NORMAL">Энгийн</option>
                <option value="SPECIAL">Онцлох</option>
              </select>
              <div className="text-red-400">{errors.type?.message}</div>
            </div>
          </div>
          <Requirements requirements={requirements} setRequirements={setRequirements} requirementsError={requirementsError} setRequirementsError={setRequirementsError}/>

          <button type="submit" className="flex justify-center max-w-fit self-center">
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
        </div>
      </form>
      { isError
        &&
        <Modal contentMessage="Алдаа гарлаа. Бүтээгдэхүүний нэр давхцаж байна." />
      }
      {
        isSuccess
        &&
        <Modal contentMessage="Амжилттай хадгаллаа" closeCallback={() => router.push('/admin/products')}/>
      }
    </div>
  )
}

const NewProductWithAuth = () => {
  return (
    <AdminAuth>
      <NewProduct />
    </AdminAuth>
  )
}
export default NewProductWithAuth
