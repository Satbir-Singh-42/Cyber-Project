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
      <Route path="/history">
        <Layout>
          <HistoryPage />
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
