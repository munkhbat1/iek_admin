import Image from 'next/image'
import Link from 'next/link';
import { FC } from 'react';

export const ProductCard: FC<ProductCardProps> = ({images, name, price, remaining, id}) => {
  const image = images[0]
  return (
    <Link href={`products/show/${id}`}>
      <a className="bg-white cursor-pointer rounded-lg w-52 shadow-lg hover:animate-pulse border-[0.5px] overflow-hidden p-2">
        <div className='relative aspect-square overflow-hidden rounded-t-lg'>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${image}`}
            alt="product image"
            layout='fill'/>
        </div>
        <div className="p-2">
        <h1 className="text-xl font-bold break-words">{name}</h1>
        <p className="mt-2 text-lg font-semibold text-gray-600">{price.toLocaleString()} &#8366;</p>
        <p className="mt-1 text-gray-500 font-">Үлдэгдэл: {remaining.toLocaleString()}</p>
      </div>
      </a>
    </Link>
  )
}

type ProductCardProps = {
  id: number | undefined;
  images: string[];
  name: string;
  price: number;
  remaining: number;
};