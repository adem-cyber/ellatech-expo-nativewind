

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  lastUpdated: string;
}
export type TransactionType = "initial" | "increase" | "decrease";
export interface Transaction {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
}
export type AppTab = "dashboard" | "products" | "users" | "history";