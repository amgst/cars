import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Car } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Fuel,
  Settings,
  Users as SeatsIcon,
  Luggage,
  DoorOpen,
  Calendar,
  Navigation,
  Bluetooth,
  Wind,
  Usb,
  Check,
} from "lucide-react";

export default function CarDetail() {
  const { id } = useParams();
  
  const { data: car, isLoading } = useQuery<Car>({
    queryKey: [`/api/cars/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Car not found</h2>
          <Link href="/cars">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Fleet
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/cars">
          <Button variant="ghost" className="mb-8" data-testid="button-back-to-cars">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fleet
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-lg mb-6 border">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
                data-testid="img-car-main"
              />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2" data-testid="text-car-name">
                  {car.name}
                </h1>
                <Badge variant="secondary" className="text-sm">
                  {car.category}
                </Badge>
              </div>
              <Badge variant={car.available ? "default" : "secondary"} className="text-sm">
                {car.available ? "Available" : "Booked"}
              </Badge>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold" data-testid="text-car-price">
                  ${car.pricePerDay}
                </span>
                <span className="text-2xl text-muted-foreground">/day</span>
              </div>
              <p className="text-sm text-muted-foreground">Year: {car.year}</p>
            </div>

            <Separator className="my-6" />

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-car-description">
                {car.description}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Specifications</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <SeatsIcon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Seats</div>
                    <div className="font-semibold">{car.seats} People</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Settings className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Transmission</div>
                    <div className="font-semibold">{car.transmission}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Fuel className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fuel Type</div>
                    <div className="font-semibold">{car.fuelType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Luggage className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Luggage</div>
                    <div className="font-semibold">{car.luggage} Bags</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <DoorOpen className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Doors</div>
                    <div className="font-semibold">{car.doors} Doors</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Year</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Features</h2>
              <div className="grid grid-cols-2 gap-4">
                {car.hasGPS && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">GPS Navigation</span>
                  </div>
                )}
                {car.hasBluetooth && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bluetooth className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Bluetooth</span>
                  </div>
                )}
                {car.hasAC && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wind className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Air Conditioning</span>
                  </div>
                )}
                {car.hasUSB && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Usb className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">USB Ports</span>
                  </div>
                )}
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Ready to Book?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Experience the thrill of driving this premium vehicle. Contact us to reserve your dates.
              </p>
              <Button className="w-full" size="lg" disabled={!car.available} data-testid="button-book-car">
                <Check className="mr-2 h-5 w-5" />
                {car.available ? "Book This Car" : "Currently Unavailable"}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
