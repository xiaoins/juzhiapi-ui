import request from './request';

export interface WalletInfo {
  userId: number;
  balance: number;
  totalRecharge: number;
  totalUsed: number;
}

export interface WalletLog {
  id: number;
  type: string;
  amount: number;
  beforeBalance: number;
  afterBalance: number;
  remark: string;
  createdAt: string;
}

export interface WalletLogResponse {
  records: WalletLog[];
  total: number;
  current: number;
  size: number;
}

export interface RechargeOrder {
  id: number;
  userId: number;
  orderNo: string;
  amount: number;
  credits: number;
  status: string;
  payType: string;
  paidAt: string | null;
  remark: string;
  createdAt: string;
}

export interface RechargeOrderResponse {
  records: RechargeOrder[];
  total: number;
  current: number;
  size: number;
}

export interface CreateRechargeOrderRequest {
  amount: number;
  payType: string;
}

export const walletApi = {
  getWallet: () => {
    return request.get<any, any>('/api/wallet');
  },

  getWalletLogs: (current = 1, size = 20) => {
    return request.get<any, any>(`/api/wallet/logs?current=${current}&size=${size}`);
  },

  createRechargeOrder: (data: CreateRechargeOrderRequest) => {
    return request.post<any, RechargeOrder>('/api/wallet/recharge', data);
  },

  getRechargeOrders: (current = 1, size = 20, status?: string) => {
    let url = `/api/wallet/orders?current=${current}&size=${size}`;
    if (status) {
      url += `&status=${status}`;
    }
    return request.get<any, RechargeOrderResponse>(url);
  },
};