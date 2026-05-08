import request from './request';

export interface Model {
  id: number;
  displayName: string;
  modelName: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  sort: number;
  enabled: number;
  recommended: number;
}

export const modelApi = {
  getModels: () => {
    return request.get<any, any>('/api/models');
  },

  getModel: (id: number) => {
    return request.get<any, any>(`/api/models/${id}`);
  },
};