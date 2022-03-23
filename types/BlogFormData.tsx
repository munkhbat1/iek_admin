export type BlogFormData = {
  title: string;
  images: FileList | null;
  video_link: string;
  blog_body: string;
  type: string;
}

export type UpdateBlogData = {
  fd: FormData;
  id: number;
}