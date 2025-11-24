import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useState, useEffect } from "react";
import { useWebsiteSettings } from "@/hooks/use-website-settings";

export function Navbar() {
  const [location] = useLocation();
  const { settings } = useWebsiteSettings();
  const [logoError, setLogoError] = useState(false);

  const websiteName = settings?.websiteName || "Tokyo Drive";
  const logoUrl = settings?.logo;

  // Reset logo error when logo URL changes
  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-md active-elevate-2">
              {logoUrl && !logoError ? (
                <img 
                  src={logoUrl} 
                  alt={websiteName} 
                  className="h-6 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Car className="h-6 w-6" />
              )}
              <span className="text-xl font-bold">{websiteName}</span>
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
            <Link href="/about">
              <Button
                variant={location === "/about" ? "default" : "ghost"}
                data-testid="link-about"
              >
                About Us
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant={location === "/contact" ? "default" : "ghost"}
                data-testid="link-contact"
              >
                Contact
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
