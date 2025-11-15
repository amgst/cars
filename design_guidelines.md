# Tokyo Drive - Car Rental Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium car rental platforms (Turo, Getaround) and automotive showcases, emphasizing visual appeal and trustworthiness.

## Typography System
- **Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern, automotive-appropriate
- **Headings**: 
  - H1: text-5xl to text-7xl, font-bold, tracking-tight
  - H2: text-4xl, font-bold
  - H3: text-2xl, font-semibold
- **Body**: text-base to text-lg, font-normal, leading-relaxed
- **Accent/Labels**: text-sm uppercase tracking-wide font-medium

## Layout & Spacing System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Section padding: py-16 md:py-24
- Card spacing: p-6
- Element gaps: gap-6 to gap-8
- Container max-widths: max-w-7xl

## Public Site Structure

### Homepage Sections (5-7 sections)
1. **Hero Section** (h-screen or min-h-[600px])
   - Large hero image showcasing premium vehicle
   - Centered headline + subtitle
   - Primary CTA button with backdrop blur
   - Search/filter bar overlaying hero bottom

2. **Featured Cars Grid** 
   - 3-column grid (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
   - Car cards with image, name, specs, price
   - Hover effects for interactivity

3. **How It Works** 
   - 3-column process steps with icons
   - Icon-title-description layout

4. **Fleet Overview/Categories**
   - Horizontal scrolling or grid of vehicle categories
   - Image cards with category labels

5. **Trust Indicators**
   - 4-column stats grid (bookings, happy customers, vehicles, locations)
   - Large numbers with descriptive labels

6. **Testimonials**
   - 2-column testimonial cards
   - Customer photos, quotes, names

7. **CTA Section**
   - Full-width with background image
   - Centered CTA with blurred button background

### Car Listing Page
- Filter sidebar (sticky on desktop, collapsible on mobile)
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile
- Car cards: vertical image, specifications list, pricing, "View Details" CTA

### Car Detail Page
- Large image gallery (primary image + thumbnails)
- 2-column layout: Left (images), Right (details, pricing, booking form)
- Specifications grid: 4-column on desktop
- Features list with checkmark icons
- Booking card (sticky on scroll)

## Admin Panel Structure

### Dashboard Layout
- Fixed sidebar navigation (w-64)
- Top header bar with user info
- Main content area with page header + breadcrumbs
- Cards for stats/quick actions

### Car Management
- Table view with sortable columns: Image thumbnail, Name, Category, Price, Status, Actions
- Row actions: Edit (pencil icon), Delete (trash icon)
- "Add New Car" prominent button (top-right)

### Add/Edit Car Form
- Single column form layout (max-w-3xl)
- Sections: Basic Info, Specifications, Pricing, Images, Availability
- Image upload with preview grid
- Dropdowns for categories, transmission, fuel type
- Number inputs for seats, doors, luggage
- Toggle switches for features (GPS, Bluetooth, etc.)
- Action buttons: Save, Cancel

## Component Library

### Navigation
- **Public**: Transparent over hero, solid on scroll, logo left, links center, CTA button right
- **Admin**: Sidebar with icons + labels, grouped by function

### Cards
- **Car Card**: rounded-xl, overflow-hidden, shadow-lg hover:shadow-xl transition
- **Stat Card**: p-6, border, rounded-lg
- **Testimonial**: p-6, border-l-4, rounded-r-lg

### Forms
- Input fields: px-4 py-3, rounded-lg, border
- Labels: text-sm font-medium mb-2
- Multi-step for booking flow

### Buttons
- **Primary**: px-6 py-3, rounded-lg, font-semibold
- **Secondary**: px-6 py-3, rounded-lg, border-2
- **Icon Buttons**: p-2, rounded-full for actions

### Icons
Use Heroicons via CDN for consistency across admin and public site

## Images

### Required Images
1. **Hero**: Wide-angle luxury car on scenic road or modern setting
2. **Featured Cars**: Professional car photography, 3/4 front angle, clean backgrounds (6-12 vehicles)
3. **Category Images**: Sedan, SUV, Sports, Luxury, Electric categories
4. **Testimonial Photos**: Customer headshots or placeholder avatars
5. **How It Works Icons**: Book, Drive, Return process illustrations

## Data Display Patterns
- **Specifications**: Icon grid with 2-column on mobile, 4-column desktop
- **Pricing**: Large price with /day suffix, breakdown on hover/expand
- **Availability**: Calendar picker component
- **Status Badges**: Rounded-full pills for Available/Booked/Maintenance

## Responsive Behavior
- Mobile: Stack all columns, full-width cards, hamburger menu
- Tablet: 2-column grids, maintain sidebar for admin
- Desktop: Full multi-column layouts, sticky elements active

## Admin-Specific Patterns
- **Delete Confirmations**: Modal overlays with warning icons
- **Success/Error Messages**: Toast notifications (top-right)
- **Loading States**: Skeleton screens for table rows
- **Bulk Actions**: Checkbox selection with action bar

This comprehensive design creates a professional car rental platform balancing visual appeal for customers with efficient management tools for administrators.