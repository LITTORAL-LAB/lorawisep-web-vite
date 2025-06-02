import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import i18n from "@/config/i18n";
import { useAuthStore } from "@/stores/authStore";
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

function RootComponent() {
  const [language, setLanguage] = useState(i18n.language);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-2 border-b bg-gray-100 dark:bg-gray-800">
          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-semibold">LoRaWISEP</h1>
          </div>
          <div className="flex gap-2 items-center">
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

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/avatars/default.png"
                        alt={user?.email}
                      />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="text-sm font-medium">{user?.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {isAuthenticated ? "Online" : "Offline"}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/login" })}
              >
                Login
              </Button>
            )}
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
  component: RootComponent,
});
