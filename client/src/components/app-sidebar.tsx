import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Car, LayoutDashboard, Plus, DollarSign, CalendarDays, Settings } from "lucide-react";
import { useWebsiteSettings } from "@/hooks/use-website-settings";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "All Cars",
    url: "/admin/cars",
    icon: Car,
  },
  {
    title: "Add New Car",
    url: "/admin/cars/new",
    icon: Plus,
  },
  {
    title: "Pricing Settings",
    url: "/admin/pricing",
    icon: DollarSign,
  },
  {
    title: "Website Settings",
    url: "/admin/website-settings",
    icon: Settings,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: CalendarDays,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { settings } = useWebsiteSettings();

  const websiteName = settings?.websiteName || "Tokyo Drive";

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <h2 className="text-xl font-bold">{websiteName}</h2>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      location === item.url || location.startsWith(item.url + "/")
                        ? "bg-sidebar-accent"
                        : ""
                    }
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
