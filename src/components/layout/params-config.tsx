import type { ICoords } from "@/@types/ICoords";
import { OptmAlgorithmsForm } from "@/components/forms/opt-algorithms-form";
import { ProjectConfigForm } from "@/components/forms/pjt-config-form";
import { SetAreaParamsForm } from "@/components/forms/set-area-params-form";
import { SimParamsForm } from "@/components/forms/sim-params-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IParamsConfigProps {
  setAreaValues: boolean;
  devices: ICoords[];
  onSimulate: () => void;
  isLoading?: boolean;
}

type FormValues = {
  simName?: string;
  simDescription?: string;
  simEnv?: string;
  simTime?: string;
  simPacketNumber?: string;
  simPropLoss?: string;
  gwQuant?: string;
  gwPos?: string;
  simWidth?: string;
  simHeight?: string;
  devicesQt?: string;
  devices?: ICoords[];
  map: boolean;
};

export function ParamsConfig({
  setAreaValues,
  devices,
  onSimulate,
  isLoading = false,
}: Readonly<IParamsConfigProps>) {
  const { t } = useTranslation();
  const [openProjectConfig, setOpenProjectConfig] = useState(false);
  const [openSimParams, setOpenSimParams] = useState(false);
  const [openOptAlgorithms, setOpenOptAlgorithms] = useState(false);
  const [openAreaParams, setOpenAreaParams] = useState(false);
  const [, setOpenResults] = useState(false);

  let isDisabled = false;
  if (!setAreaValues) {
    isDisabled = devices.length <= 0;
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      simName: t("defaultSimName") || "SimulacaoTeste",
      simEnv: "rural",
      simDescription: "",
      simTime: "3600",
      simPacketNumber: "3600",
      simPropLoss: "ns3",
      simWidth: "1000",
      simHeight: "1000",
      devicesQt: "10",
      gwPos: "kmeans",
      gwQuant: "gap",
      devices: devices,
      map: false,
    },
  });

  function distributeDevicesRandomly(
    n: number,
    width: number,
    height: number
  ): ICoords[] {
    const devices: ICoords[] = [];

    for (let i = 0; i < n; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      devices.push({ lat: x, lng: y });
    }
    return devices;
  }

  const onSubmit = (values: FormValues): void => {
    if (!values.simName || !values.simEnv || !values.gwQuant || !values.gwPos) {
      toast("formErrorTitle", {
        description: t("formErrorDescription"),
      });
    } else {
      toast("formSubmitted", {
        description: t("checkConsoleForDetails"),
      });

      console.log("Form values:", values);

      const devices = distributeDevicesRandomly(
        Number(values.devicesQt),
        Number(values.simWidth),
        Number(values.simHeight)
      );

      methods.setValue("devices", devices);
      methods.setValue("map", true);

      if (setAreaValues) {
        toast("distributingDevices", {
          description: t("pleaseWait"),
        });
        if (values.simWidth && values.simHeight && values.devicesQt) {
          const devices = distributeDevicesRandomly(
            Number(values.devicesQt),
            Number(values.simWidth),
            Number(values.simHeight)
          );
          methods.setValue("devices", devices);
          methods.setValue("map", false);

          toast("devicesDistributed", {
            description: t("devicesDistributed"),
          });
        } else {
          toast("formError", {
            description: t("formErrorDescription"),
          });
          return;
        }
      }

      console.log(methods.getValues());

      setOpenResults(true);

      onSimulate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("simulationParamsTitle")}</CardTitle>
        <CardDescription>{t("simulationParamsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <CodeViewer open={openResults} setOpen={setOpenResults} /> */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("projectConfiguration")}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-rows-2 gap-2">
                    <p className="text-sm text-muted-foreground">
                      {t("projectConfigurationDescription")}
                    </p>
                    <Dialog
                      open={openProjectConfig}
                      onOpenChange={setOpenProjectConfig}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => setOpenProjectConfig(true)}
                        >
                          {t("openToConfigure")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{t("projectConfigTitle")}</DialogTitle>
                          <DialogDescription>
                            {t("projectConfigDescription")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6">
                          <ProjectConfigForm />
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            onClick={() => setOpenProjectConfig(false)}
                          >
                            {t("save")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>{t("simulationParams")}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-rows-2 gap-2">
                    <p className="text-sm text-muted-foreground">
                      {t("simulationParamsDescription")}
                    </p>
                    <Dialog
                      open={openSimParams}
                      onOpenChange={setOpenSimParams}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => setOpenSimParams(true)}
                        >
                          {t("openToConfigure")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            {t("simulationConfigTitle")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("simulationConfigDescription")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6">
                          <SimParamsForm />
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            onClick={() => setOpenSimParams(false)}
                          >
                            {t("save")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  {t("optimizationAlgorithms")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-rows-2 gap-2">
                    <p className="text-sm text-muted-foreground">
                      {t("optimizationAlgorithmsDescription")}
                    </p>
                    <Dialog
                      open={openOptAlgorithms}
                      onOpenChange={setOpenOptAlgorithms}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => setOpenOptAlgorithms(true)}
                        >
                          {t("openToConfigure")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            {t("optimizationConfigTitle")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("optimizationConfigDescription")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6">
                          <OptmAlgorithmsForm />
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            onClick={() => setOpenOptAlgorithms(false)}
                          >
                            {t("save")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {setAreaValues && (
                <AccordionItem value="item-4">
                  <AccordionTrigger>{t("setAreaValues")}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-rows-2 gap-2">
                      <p className="text-sm text-muted-foreground">
                        {t("setAreaValuesDescription")}
                      </p>
                      <Dialog
                        open={openAreaParams}
                        onOpenChange={setOpenAreaParams}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            className="w-full"
                            onClick={() => setOpenAreaParams(true)}
                          >
                            {t("openToConfigure")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{t("areaConfigTitle")}</DialogTitle>
                            <DialogDescription>
                              {t("areaConfigDescription")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-6">
                            <SetAreaParamsForm />
                          </div>
                          <DialogFooter className="mt-6">
                            <Button
                              type="button"
                              onClick={() => setOpenAreaParams(false)}
                            >
                              {t("save")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <div className="mt-6 space-y-2">
              <Button
                className="w-full"
                type="submit"
                disabled={isDisabled || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("simulating")}
                  </>
                ) : (
                  t("simulate")
                )}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={() => {
                  methods.reset();
                }}
                disabled={isLoading}
              >
                {t("clear")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
