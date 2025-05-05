import { ICoords } from "@/@types/ICoords";
import { MapLayout } from "@/components/layout/map-layout";
import { ParamsConfig } from "@/components/layout/params-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("map");
  const [devices, setDevices] = useState<ICoords[]>([]);
  const [gateways, setGateways] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const handleSimulate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row gap-4">
        <div
          className={`${fullScreen ? "w-full" : "w-full lg:w-2/3"} transition-all duration-300`}
        >
          <Tabs
            defaultValue="map"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="view" className="flex-1">
                {t("graphs")}
              </TabsTrigger>
              <TabsTrigger value="map" className="flex-1">
                {t("map")}
              </TabsTrigger>
            </TabsList>
            <div className="p-4">
              <TabsContent value="view" className="mt-0">
                <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{t("graphs")}</h3>
                    <p className="text-muted-foreground">
                      {t("visualize_your_data")}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="map">
                <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      <MapLayout
                        setFullScreen={toggleFullScreen}
                        fullScreen={fullScreen}
                        onSave={(devices) => {
                          setDevices(devices || []);
                        }}
                        onDelete={() => {
                          setDevices([]);
                          setGateways([]);
                        }}
                        gateways={gateways}
                      />
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {!fullScreen && (
          <div className="w-full lg:w-1/3 transition-all duration-300">
            <ParamsConfig
              setAreaValues={activeTab !== "map"}
              devices={devices}
              onSimulate={handleSimulate}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
