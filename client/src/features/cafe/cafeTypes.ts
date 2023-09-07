export interface Cafe {
  id: string | null;
  name: string;
  description: string;
  logo: any;
  location: string;
  employees: number;
}

export interface CafeState {
  cafes: Cafe[];
  loading: boolean;
  error: string | null;
}
