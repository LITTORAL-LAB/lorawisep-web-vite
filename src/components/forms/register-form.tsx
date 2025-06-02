import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        formData.nome,
        formData.email,
        formData.senha,
        t("registerFailed")
      );
      toast.success(t("registerSuccess"));
      navigate({ to: "/login" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("registerFailed");
      toast.error(errorMessage);
      setFormData((prev) => ({ ...prev, senha: "" })); // Limpa apenas a senha em caso de erro
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("register.createAccount")}</CardTitle>
          <CardDescription>{t("register.enterYourDetails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="nome">{t("register.name")}</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder={t("register.namePlaceholder")}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">{t("register.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="m@example.com"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="senha">{t("register.password")}</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder={t("register.passwordPlaceholder")}
                />
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("loading") : t("register.submit")}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              {t("register.alreadyHaveAccount")}{" "}
              <a href="/login" className="underline underline-offset-4">
                {t("register.loginHere")}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
