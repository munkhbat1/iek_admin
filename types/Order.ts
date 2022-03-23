import { OrderStatus } from "../pages/admin/orders";

export type OrderListItem = {
  id: number;
  invoice_id: string;
  status: keyof typeof OrderStatus;
  user_id: number;
  name: string;
  address: string;
  phone: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderIndex = {
  items: OrderListItem[];
  total_pages: number;
}

export type OrderDetailIndex = {
  order: OrderListItem;
  orderDetails: OrderDetailListItem[];
}

export type OrderDetailListItem = {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  requirement: string;
  createdAt: string;
  updatedAt: string;
}