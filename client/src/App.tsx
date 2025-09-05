import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import PasswordAnalyzerPage from "@/pages/password-analyzer-page";
import PhishingDetectorPage from "@/pages/phishing-detector-page";
import PortScannerPage from "@/pages/port-scanner-page";
import KeyloggerDetectorPage from "@/pages/keylogger-detector-page";
import FileIntegrityPage from "@/pages/file-integrity-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Main App Routes (With Layout) */}
      <Route path="/">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/password-analyzer">
        <Layout>
          <PasswordAnalyzerPage />
        </Layout>
      </Route>
      <Route path="/phishing-detector">
        <Layout>
          <PhishingDetectorPage />
        </Layout>
      </Route>
      <Route path="/port-scanner">
        <Layout>
          <PortScannerPage />
        </Layout>
      </Route>
      <Route path="/keylogger-detector">
        <Layout>
          <KeyloggerDetectorPage />
        </Layout>
      </Route>
      <Route path="/file-integrity">
        <Layout>
          <FileIntegrityPage />
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cybersec-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
