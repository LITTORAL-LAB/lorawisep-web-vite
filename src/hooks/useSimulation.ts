import { SimulationService } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export function useSimulation() {
  const generateGatewaysMutation = useMutation({
    mutationFn: SimulationService.generateGateways,
  });

  const runSimulationMutation = useMutation({
    mutationFn: SimulationService.runSimulation,
  });

  return {
    generateGateways: generateGatewaysMutation.mutateAsync,
    generateGatewaysLoading: generateGatewaysMutation.isPending,
    generateGatewaysError: generateGatewaysMutation.error,
    
    runSimulation: runSimulationMutation.mutateAsync,
    runSimulationLoading: runSimulationMutation.isPending,
    runSimulationError: runSimulationMutation.error,
    simulationResult: runSimulationMutation.data,
  };
}