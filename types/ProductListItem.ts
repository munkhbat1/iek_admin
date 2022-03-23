export type ProductListItem = {
  id?: number;
  images: string[];
  name: string;
  price: number;
  remaining: number
  requirements: string[];
  category: {
    value: string;
    key: string;
  };
  type: string;
}

export type ProductIndex = {
  items: ProductListItem[],
  total_pages: number,
}

export type UpdateProductData = {
  fd: FormData;
  id: number;
}