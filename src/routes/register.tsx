import { RegisterForm } from "@/components/forms/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex" style={{ height: "calc(100vh - 90px)" }}>
      <div className="m-auto p-4 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
