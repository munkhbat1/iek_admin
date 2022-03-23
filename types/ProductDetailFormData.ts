export type ProductDetailFormData = {
  images: FileList | null;
  name: string;
  price: number | undefined;
  remaining: number | undefined;
  requirements: string[];
  category: string;
  type: string;
}