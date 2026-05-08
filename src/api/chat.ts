import request from './request';

export interface SendMessageData {
  sessionId?: number;
  modelName: string;
  message: string;
}

export interface Message {
  id: number;
  sessionId: number;
  role: string;
  content: string;
  modelName: string;
  tokenCount: number;
  createdAt: string;
}

export interface Session {
  id: number;
  title: string;
  modelName: string | null;
  createdAt: string;
  updatedAt: string;
}

export const chatApi = {
  getSessions: (current = 1, size = 20) => {
    return request.get<any, any>(`/api/chat/sessions?current=${current}&size=${size}`);
  },

  createSession: (data?: { modelName?: string; title?: string }) => {
    return request.post<any, any>('/api/chat/session', data);
  },

  deleteSession: (sessionId: number) => {
    return request.delete<any, any>(`/api/chat/session/${sessionId}`);
  },

  getMessages: (sessionId: number, current = 1, size = 50) => {
    return request.get<any, any>(`/api/chat/messages/${sessionId}?current=${current}&size=${size}`);
  },

  sendMessage: (data: SendMessageData) => {
    return request.post<any, any>('/api/chat/send', data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      responseType: 'stream',
    });
  },
};