import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import i18n from "@/config/i18n";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

function RootComponent() {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-2 border-b bg-gray-100 dark:bg-gray-800">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-semibold">LoRaWISEP</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => changeLanguage("en")}
            >
              English
            </Button>
            <Button
              variant={language === "pt" ? "default" : "outline"}
              size="sm"
              onClick={() => changeLanguage("pt")}
            >
              Português
            </Button>
            <ModeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>

        {/* Devtools and Toaster */}
        <TanStackRouterDevtools />
        <Toaster />
      </div>
    </I18nextProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent, // Usando o componente aqui
});
