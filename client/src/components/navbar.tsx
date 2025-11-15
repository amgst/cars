import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-md active-elevate-2">
              <Car className="h-6 w-6" />
              <span className="text-xl font-bold">Tokyo Drive</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                data-testid="link-home"
              >
                Home
              </Button>
            </Link>
            <Link href="/cars">
              <Button
                variant={location.startsWith("/cars") && !location.startsWith("/admin") ? "default" : "ghost"}
                data-testid="link-cars"
              >
                Our Fleet
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" data-testid="link-admin">
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
