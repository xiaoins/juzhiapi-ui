import request from './request';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email?: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  role: string;
  status: number;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: UserInfo;
}

export const authApi = {
  login: (data: LoginData) => {
    return request.post<any, any>('/api/auth/login', data);
  },

  register: (data: RegisterData) => {
    return request.post<any, any>('/api/auth/register', data);
  },

  logout: () => {
    return request.post<any, any>('/api/auth/logout');
  },

  getCurrentUser: () => {
    return request.get<any, any>('/api/auth/me');
  },
};