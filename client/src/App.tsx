import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import PasswordAnalyzerPage from "@/pages/password-analyzer-page";
import PhishingDetectorPage from "@/pages/phishing-detector-page";
import PortScannerPage from "@/pages/port-scanner-page";
import KeyloggerDetectorPage from "@/pages/keylogger-detector-page";
import FileIntegrityPage from "@/pages/file-integrity-page";
import HistoryPage from "@/pages/history-page";
import SettingsPage from "@/pages/settings-page";
import LoginPage from "@/pages/login-page";
import SignupPage from "@/pages/signup-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Auth Routes (No Layout) */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      
      {/* Main App Routes (With Layout) */}
      <Route path="/">
        {(params) => (
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/password-analyzer" component={PasswordAnalyzerPage} />
              <Route path="/phishing-detector" component={PhishingDetectorPage} />
              <Route path="/port-scanner" component={PortScannerPage} />
              <Route path="/keylogger-detector" component={KeyloggerDetectorPage} />
              <Route path="/file-integrity" component={FileIntegrityPage} />
              <Route path="/history" component={HistoryPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
