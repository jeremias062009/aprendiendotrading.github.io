import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdmin } from "@/hooks/useAdmin";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminPanel from "@/pages/AdminPanel";
import EBooks from "@/pages/EBooks";
import Tutorials from "@/pages/Tutorials";
import RealTimeData from "@/pages/RealTimeData";
import AIStrategies from "@/pages/AIStrategies";
import Navigation from "@/components/Navigation";
import AdminLoginModal from "@/components/AdminLoginModal";

function Router() {
  const { isAdmin } = useAdmin();

  return (
    <div className={isAdmin ? 'admin-visible' : ''}>
      <Navigation />
      <AdminLoginModal />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ebooks" component={EBooks} />
        <Route path="/tutorials" component={Tutorials} />
        <Route path="/real-time" component={RealTimeData} />
        <Route path="/ai-strategies" component={AIStrategies} />
        {isAdmin && <Route path="/admin" component={AdminPanel} />}
        <Route component={NotFound} />
      </Switch>
    </div>
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
