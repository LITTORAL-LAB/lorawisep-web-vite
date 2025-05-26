import axios from 'axios';

// Configuração base da API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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