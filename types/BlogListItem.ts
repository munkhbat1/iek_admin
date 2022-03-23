export type BlogListItem = {
  id: number;
  title: string;
  image?: string;
  video_link?: string;
  type: string;
  blog_body: string;
}

export type BlogIndex = {
  items: BlogListItem[],
  total_pages: number,
}