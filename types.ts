
export enum BillStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export enum BillType {
  OWED_BY_ME = 'Eu devo',
  OWED_TO_ME = 'Me devem'
}

export enum IncomeCategory {
  SALARIO = 'Salário',
  INVESTIMENTO = 'Investimento',
  FREELANCE = 'Freelance',
  OUTROS = 'Outros'
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  type: BillType;
  description?: string;
  imageUrl?: string;
  dueDate: string;
  paidDate?: string;
  status: BillStatus;
  uid?: string;
}

export interface Income {
  id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  date: string;
  uid?: string;
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
