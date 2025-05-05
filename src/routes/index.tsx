import { ICoords } from "@/@types/ICoords";
import { ParamsConfig } from "@/components/params-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("map");
  const [devices] = useState<ICoords[]>([]);
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div
          className={`${fullScreen ? "w-full" : "w-full lg:w-2/3"} transition-all duration-300`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">{t("dashboard")}</h2>
            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
              {fullScreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Tabs
                defaultValue="map"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="view">{t("graphs")}</TabsTrigger>
                  <TabsTrigger value="map">{t("map")}</TabsTrigger>
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
                  <TabsContent value="map" className="mt-0">
                    <div className="aspect-video bg-muted/20 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-medium">{t("map")}</h3>
                        <p className="text-muted-foreground">
                          {t("view_spatial_data")}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
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
