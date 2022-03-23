import Image from 'next/image'
import Link from 'next/link';
import { FC } from 'react';
import * as marked from "marked"
import { BlogListItem } from '../types/BlogListItem';

export const BlogCard: FC<BlogListItem> = ({id, title, image, video_link, type, blog_body}) => {

  if (video_link) {
    const queryString = video_link.split('?')[1]
    const queryStringParams = new URLSearchParams(queryString)
    if (queryStringParams.has('v')) {
      video_link = queryStringParams.get('v') || ''
    } else {
      video_link = ''
    }
  }

  return (
    <Link href={`blogs/show/${id}`}>
      <a className="bg-white cursor-pointer rounded-lg w-52 shadow-lg hover:animate-pulse border-[0.5px] overflow-hidden p-2">
        <div className='relative aspect-square overflow-hidden rounded-t-lg'>
          {
            image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URI}/uploads/images/${image}`}
                alt="blog image"
                layout='fill'/>
            ) : video_link ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`https://img.youtube.com/vi/${video_link}/0.jpg`} alt="blog image" />
            ) :(<div>No image or video</div>)
          }
        </div>
        <div className="p-2">
        <h1 className="text-xl font-bold break-words">{title}</h1>
        <p className="mt-2 text-lg font-semibold text-gray-600">{type}</p>
        <p className="mt-1 text-gray-500" dangerouslySetInnerHTML={ {__html: marked.parse(blog_body)} }></p>
      </div>
      </a>
    </Link>
  )
}