import axios from 'axios';

// Configuração base da API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos para autenticação
interface LoginData {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserData {
  id: string;
  email: string;
  // Adicione outros campos do usuário conforme necessário
}

// Tipos para a API
interface DevicePosition {
  lat: number;
  lng: number;
}

interface SimulationParameters {
  devices: DevicePosition[];
  simulationTime?: number;
  nDevices?: number;
  radius?: number;
}

export interface SimulationResult {
  data: {
    success: boolean;
    result: {
      sent_packets: number;
      received_packets: number;
      received_ratio: number;
    };
    gateway_positions: DevicePosition[];
    parameters: SimulationParameters;
  };
}

// Serviços da API
export const SimulationService = {
  async generateGateways(devices: DevicePosition[]) {
    const response = await apiClient.post('api/v1/simulation/gateways', { devices });
    return response.data;
  },

  async runSimulation(params: DevicePosition[]) {
    const response = await apiClient.post('api/v1/simulation/run', params);
    return response.data as SimulationResult;
  },
};

// Serviços de autenticação
export const AuthService = {
  async login(credentials: LoginData): Promise<TokenResponse> {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    params.append('grant_type', 'password');
    params.append('client_id', 'string');
    params.append('client_secret', 'string');

    const response = await apiClient.post('api/v1/contas/entrar', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async getCurrentUser(): Promise<UserData> {
    const response = await apiClient.get('api/v1/contas/me');
    return response.data;
  },

  async refreshToken(): Promise<TokenResponse> {
    const response = await apiClient.post('api/v1/contas/refresh');
    return response.data;
  },

  register: async (data: { nome: string; email: string; senha: string }) => {
    const response = await apiClient.post('api/v1/contas/registrar', data);
    return response.data;
  },
};