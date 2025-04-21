import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DiagnosticPage from "@/pages/diagnostic-page";
import RepairGuidesPage from "@/pages/repair-guides-page";
import PartsCatalogPage from "@/pages/parts-catalog-page";
import ServiceHistoryPage from "@/pages/service-history-page";
import SystemDiagramsPage from "@/pages/system-diagrams-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/diagnose" component={DiagnosticPage} />
      <ProtectedRoute path="/repair-guides" component={RepairGuidesPage} />
      <ProtectedRoute path="/parts" component={PartsCatalogPage} />
      <ProtectedRoute path="/service-history" component={ServiceHistoryPage} />
      <ProtectedRoute path="/system-diagrams" component={SystemDiagramsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
