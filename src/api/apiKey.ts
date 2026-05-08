import request from './request';

export interface ApiKey {
  id: number;
  name: string | null;
  keyPrefix: string;
  apiKey: string | null;
  status: number;
  totalCalls: number;
  totalCost: number;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface ApiKeyResponse {
  records: ApiKey[];
  total: number;
  current: number;
  size: number;
}

export const apiKeyApi = {
  getApiKeys: (current = 1, size = 20) => {
    return request.get<any, any>(`/api/api-keys?current=${current}&size=${size}`);
  },

  createApiKey: (name?: string) => {
    return request.post<any, any>('/api/api-keys', { name });
  },

  deleteApiKey: (id: number) => {
    return request.delete<any, any>(`/api/api-keys/${id}`);
  },

  enableApiKey: (id: number) => {
    return request.put<any, any>(`/api/api-keys/${id}/enable`);
  },

  disableApiKey: (id: number) => {
    return request.put<any, any>(`/api/api-keys/${id}/disable`);
  },
};