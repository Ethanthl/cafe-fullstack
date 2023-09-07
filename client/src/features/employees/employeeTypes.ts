export interface Employee {
    id: string | null;
    name: string;
    email_address: string;
    phone_number: string;
    gender: string;
    cafe_id: string | null;
    cafe_name: string | null;
    days_worked: string | null;
  }
  
  export interface EmployeeState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
  }