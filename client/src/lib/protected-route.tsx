import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  userType?: "customer" | "business" | "both";
};

export function ProtectedRoute({
  path,
  component: Component,
  userType = "both",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (userType !== "both" && user.userType !== userType) {
    return (
      <Route path={path}>
        {user.userType === "customer" ? (
          <Redirect to="/dashboard/customer" />
        ) : (
          <Redirect to="/dashboard/business" />
        )}
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
