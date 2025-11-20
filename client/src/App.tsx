import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Cars from "@/pages/cars";
import CarDetail from "@/pages/car-detail";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import CarsList from "@/pages/admin/cars-list";
import CarForm from "@/pages/admin/car-form";
import PricingSettings from "@/pages/admin/pricing-settings";
import AdminBookings from "@/pages/admin/bookings";

function AdminRouter() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <Switch>
                <Route path="/admin/cars/new" component={CarForm} />
                <Route path="/admin/cars/:id/edit" component={CarForm} />
                <Route path="/admin/cars" component={CarsList} />
                <Route path="/admin/pricing" component={PricingSettings} />
                <Route path="/admin/bookings" component={AdminBookings} />
                <Route path="/admin" component={AdminDashboard} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PublicRouter() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/cars" component={Cars} />
          <Route path="/cars/:slug" component={CarDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/cars/new" component={AdminRouter} />
      <Route path="/admin/cars/:id/edit" component={AdminRouter} />
      <Route path="/admin/cars" component={AdminRouter} />
      <Route path="/admin/pricing" component={AdminRouter} />
      <Route path="/admin/bookings" component={AdminRouter} />
      <Route path="/admin" component={AdminRouter} />
      <Route component={PublicRouter} />
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