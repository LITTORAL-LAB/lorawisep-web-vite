// components/results-modal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

export interface SimulationResult {
  sent_packets: number;
  received_packets: number;
  received_ratio: number;
}

export interface GatewayPosition {
  lat: number;
  lng: number;
}

export interface SimulationResponse {
  data: {
    result: SimulationResult;
    gateway_positions: GatewayPosition[];
    end_devices_positions: GatewayPosition[];
    gateways_file: string;
    devices_file: string;
  };
}

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results?: SimulationResponse;
}

export function ResultsModal({
  open,
  onOpenChange,
  results,
}: Readonly<ResultsModalProps>) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("simulationResults")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Resultados principais */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {t("performanceMetrics")}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("sentPackets")}
                  </p>
                  <p className="text-2xl font-bold">
                    {results?.data.result.sent_packets}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("receivedPackets")}
                  </p>
                  <p className="text-2xl font-bold">
                    {results?.data.result.received_packets}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("receptionRate")}
                  </p>
                  <p className="text-2xl font-bold">
                    {results?.data?.result?.received_ratio !== undefined
                      ? (results.data.result.received_ratio * 100).toFixed(2) +
                        "%"
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Posições dos gateways */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {t("gatewayPositions")} (
                {results?.data.gateway_positions.length})
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("gateway")}</TableHead>
                    <TableHead>{t("latitude")}</TableHead>
                    <TableHead>{t("longitude")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results?.data.gateway_positions.map((gw, index) => (
                    <TableRow key={index}>
                      <TableCell>GW {index + 1}</TableCell>
                      <TableCell>{gw.lat.toFixed(6)}</TableCell>
                      <TableCell>{gw.lng.toFixed(6)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Posições dos dispositivos */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {t("devicePositions")} (
                {results?.data.end_devices_positions.length})
              </h3>
              <div className="overflow-auto max-h-60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("device")}</TableHead>
                      <TableHead>{t("latitude")}</TableHead>
                      <TableHead>{t("longitude")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results?.data.end_devices_positions.map(
                      (device, index) => (
                        <TableRow key={index}>
                          <TableCell>Device {index + 1}</TableCell>
                          <TableCell>{device.lat.toFixed(6)}</TableCell>
                          <TableCell>{device.lng.toFixed(6)}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Arquivos gerados */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {t("generatedFiles")}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("gatewaysFile")}:</span>
                  <span className="text-muted-foreground text-sm">
                    {results?.data.gateways_file}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t("devicesFile")}:</span>
                  <span className="text-muted-foreground text-sm">
                    {results?.data.devices_file}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
