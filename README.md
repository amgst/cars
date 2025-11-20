# Car Rental Management System

A full-stack car rental management system built with React, Express, Firebase, and Vercel.

## Features

- 🚗 Car listing and management
- 📸 Image upload and gallery
- 💰 Dynamic pricing calculator
- 📅 Booking system
- 🔐 Admin dashboard
- ⚙️ Configurable pricing settings

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: Firebase Firestore
- **Storage**: Vercel Blob Storage (production) / Local filesystem (development)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Vercel account (for production deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cars
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`:
   - Firebase configuration
   - Vercel Blob Storage token (for production)

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### Building for Production

Build the application:
```bash
npm run build
```

## Deployment to Vercel

### Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Set up Vercel Blob Storage:
   - Go to your Vercel project settings
   - Navigate to Storage → Blob
   - Create a new Blob store
   - Copy the `BLOB_READ_WRITE_TOKEN`

### Deployment Steps

1. **Link your project to Vercel:**
```bash
vercel
```

2. **Set environment variables in Vercel Dashboard:**
   - Go to your project settings → Environment Variables
   - Add all variables from `.env.example`:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `BLOB_READ_WRITE_TOKEN` (required for image uploads)

3. **Deploy:**
```bash
vercel --prod
```

Or push to your connected Git repository and Vercel will auto-deploy.

### Environment Variables

#### Required for Production:
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage token for file uploads
- `VITE_FIREBASE_*`: Firebase configuration variables

#### Optional:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Project Structure

```
├── api/                 # Vercel serverless functions
├── client/              # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utilities and Firebase config
├── server/              # Express server
│   ├── routes.ts       # API routes
│   ├── upload.ts       # File upload handling
│   └── storage.ts      # In-memory storage
├── shared/             # Shared schemas
└── vercel.json         # Vercel configuration
```

## Features

### Admin Features
- Dashboard with car statistics
- Add/Edit/Delete cars
- Configure pricing settings (insurance, delivery, tax rates)
- Image upload and management

### Public Features
- Browse available cars
- View car details with image gallery
- Price estimator with configurable options
- Booking form

## File Upload

- **Development**: Files are stored locally in `attached_assets/uploads/`
- **Production**: Files are stored in Vercel Blob Storage

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Add the configuration to your `.env` file

## License

MIT

