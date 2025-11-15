# Tokyo Drive - Premium Car Rental Website

A professional car rental website featuring a public showcase of luxury vehicles and a comprehensive admin panel for complete vehicle management.

## Overview

Tokyo Drive is a full-stack car rental platform inspired by tokyodrive.com.au. The application provides:
- **Public Site**: Beautiful homepage with hero section, featured cars, trust indicators, testimonials, and comprehensive car listings with filtering
- **Admin Panel**: Complete CRUD interface for managing the vehicle inventory with dashboard analytics
- **Backend API**: RESTful endpoints with Zod validation for all car operations

## Recent Changes (November 15, 2025)

### Latest Updates
- Fixed numeric form inputs to use `valueAsNumber` for proper type coercion in admin car forms
- Added search/filter overlay to hero section with category and transmission selectors
- Implemented testimonials section on homepage
- Fixed admin routing to handle `/admin` and `/admin/*` paths correctly
- Added `data-testid` attributes to all interactive elements for testing
- Removed design guideline violations (one-sided borders on cards)

### Implementation Complete
- ✅ All public pages (home, cars listing, car details)
- ✅ Complete admin panel (dashboard, car list, add/edit forms)
- ✅ Full CRUD API with validation
- ✅ 6 seed cars with realistic data
- ✅ Design guidelines compliance
- ✅ Responsive design with dark mode support

## Project Architecture

### Frontend Structure
- **Pages**:
  - `/` - Homepage with hero, featured cars, how it works, testimonials, CTA
  - `/cars` - Car listing page with filters (category, transmission, seats)
  - `/cars/:id` - Individual car detail pages with specifications
  - `/admin` - Admin dashboard with statistics
  - `/admin/cars` - Car management table with delete functionality
  - `/admin/cars/new` - Add new car form
  - `/admin/cars/:id/edit` - Edit existing car form

- **Components**:
  - Navbar with theme toggle
  - Car cards with hover effects
  - Admin sidebar navigation
  - Form components with validation
  - Loading skeletons

### Backend Structure
- **Storage**: In-memory storage (MemStorage) with IStorage interface
- **Routes**: RESTful API endpoints in `server/routes.ts`
  - `GET /api/cars` - List all cars
  - `GET /api/cars/:id` - Get single car
  - `POST /api/cars` - Create car (validated with Zod)
  - `PATCH /api/cars/:id` - Update car (validated with Zod)
  - `DELETE /api/cars/:id` - Delete car
- **Validation**: Zod schemas from `drizzle-zod` for type-safe operations

### Data Model (`shared/schema.ts`)
```typescript
Car {
  id: number
  name: string
  category: string (Sedan|SUV|Sports|Luxury|Electric)
  description: string
  image: string
  pricePerDay: number
  seats: number
  transmission: string (Automatic|Manual)
  fuelType: string (Petrol|Diesel|Electric|Hybrid)
  luggage: number
  doors: number
  year: number
  hasGPS: boolean
  hasBluetooth: boolean
  hasAC: boolean
  hasUSB: boolean
  available: boolean
}
```

## Key Technical Decisions

1. **In-Memory Storage**: Using MemStorage for rapid prototyping per JavaScript blueprint
2. **Number Input Handling**: All numeric form fields use `valueAsNumber` to properly convert string inputs to numbers for Zod validation
3. **Routing**: Using wouter with proper route handling for admin nested routes
4. **State Management**: TanStack Query for server state with proper cache invalidation
5. **Form Handling**: React Hook Form with Zod validation using `zodResolver`
6. **Design System**: Shadcn UI components with custom color tokens following design_guidelines.md

## Design Guidelines Compliance

The application strictly follows `design_guidelines.md`:
- ✅ No one-sided borders on rounded elements
- ✅ Proper use of shadcn Button, Card, Badge components
- ✅ Consistent spacing (small/medium/large scale)
- ✅ Proper text hierarchy (default/secondary/tertiary colors)
- ✅ Hero section with dark wash gradient for text readability
- ✅ All interactive elements have `data-testid` attributes
- ✅ Hover and active states using `hover-elevate` and `active-elevate-2` utilities
- ✅ No custom hover/active colors on Buttons or Badges

## User Preferences

- Prefer in-memory storage unless explicitly asked for database
- Follow design_guidelines.md religiously for all UI/UX changes
- Use shadcn components consistently throughout the application
- Maintain responsive design for mobile and desktop
- Keep forms simple with proper validation feedback

## Testing Notes

All interactive elements have `data-testid` attributes following the pattern:
- Buttons: `button-{action}` (e.g., `button-submit`, `button-delete`)
- Inputs: `input-{field}` (e.g., `input-name`, `input-price`)
- Links: `link-{destination}` (e.g., `link-home`, `link-admin`)
- Cards: `card-car-{id}` for dynamic elements

## Running the Project

The workflow "Start application" runs `npm run dev` which:
- Starts Express server on port 5000 for backend
- Starts Vite dev server for frontend
- Serves both on the same port via Vite proxy

## Next Phase Features (Not MVP)

- Image upload functionality for car photos
- Authentication system for admin access
- User booking system
- Payment integration
- Email notifications
- Advanced filtering options
- Car availability calendar
