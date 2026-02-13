
export enum BillStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export enum Category {
  UTILIDADES = 'Utilidades',
  ALIMENTACAO = 'Alimentação',
  GERAL = 'Geral',
  MORADIA = 'Moradia'
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  category: Category;
  dueDate: string;
  paidDate?: string;
  status: BillStatus;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  date: string;
  billId?: string;
  read: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'pt' | 'en';

export interface User {
  name: string;
  email: string;
  avatar?: string;
}
