export interface User {
  id: number;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}