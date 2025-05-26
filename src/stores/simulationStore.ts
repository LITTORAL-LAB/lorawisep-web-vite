// src/stores/simulationStore.ts
import { ICoords } from '@/@types/ICoords';
import { create } from 'zustand';

interface SimulationState {
  devices: ICoords[];
  gateways: ICoords[];
  isLoadingSimulation: boolean; // Para o loading da simulação NS-3
  // Outros estados globais que você possa precisar no futuro
  
  setDevices: (devices: ICoords[]) => void;
  addDevice: (device: ICoords) => void;
  updateDevicePosition: (index: number, newPosition: ICoords) => void;
  clearDevices: () => void;

  setGateways: (gateways: ICoords[]) => void;
  clearGateways: () => void;

  setIsLoadingSimulation: (isLoading: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  devices: [],
  gateways: [],
  isLoadingSimulation: false,

  setDevices: (devices) => set({ devices }),
  addDevice: (device) => set((state) => ({ devices: [...state.devices, device] })),
  updateDevicePosition: (index, newPosition) =>
    set((state) => {
      const updatedDevices = [...state.devices];
      if (index >= 0 && index < updatedDevices.length) {
        updatedDevices[index] = newPosition;
      }
      return { devices: updatedDevices };
    }),
  clearDevices: () => set({ devices: [] }),

  setGateways: (gateways) => set({ gateways }),
  clearGateways: () => set({ gateways: [] }),

  setIsLoadingSimulation: (isLoading) => set({ isLoadingSimulation: isLoading }),
}));