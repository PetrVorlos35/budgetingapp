export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}

export interface Trip {
  id: number;
  user_id: number;
  title: string;
  start_date: Date;
  end_date: Date;
}

export interface Folder {
  id: number;
  user_id: number;
  name: string;
  created_at: Date;
}

export interface TripExpense {
  id: number;
  trip_id: number;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export interface GeneralExpense {
  id: number;
  folder_id: number;
  amount: number;
  description: string;
  created_at: Date;
}
