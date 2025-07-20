# Rentiva Car Rental Platform

Rentiva is a modern car rental web application designed to provide a seamless experience for users to browse, book, and manage car rentals. Built with React, Tailwind CSS, and Shadcn UI, it features a clean, responsive design and a user-friendly interface.

## Features
- **Home Page:** Hero section, feature highlights, vehicle showcase, and call-to-action.
- **Vehicle Listing:** Browse and filter a fleet of vehicles by type, search, and view modes (grid/list).
- **Vehicle Details:** Detailed view for each vehicle, including specs, features, and booking options.
- **Booking:** Guided booking process with personal info, rental details, and price calculation.
- **Authentication:** User login and registration with form validation and social login options.
- **About Page:** Company story, values, stats, and team introduction.
- **Contact Page:** Contact info, business hours, and a contact form.
- **Consistent Layout:** Header with navigation and authentication links, and a comprehensive footer.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, Shadcn UI, Lucide Icons
- **Routing:** React Router DOM
- **Forms:** React Hook Form
- **Date Handling:** date-fns

## Project Structure
```
project/
├── src/
│   ├── components/         # Reusable UI and layout components
│   ├── pages/              # Main app pages (Home, Vehicles, Details, Booking, Auth, About, Contact)
│   ├── lib/                # Utility functions
│   └── index.tsx, App.tsx  # App entry and routing
├── public/                 # Static assets
├── tailwind.css            # Tailwind base styles
├── tailwind.config.js      # Tailwind config
├── package.json            # Dependencies and scripts
└── vite.config.ts          # Vite config
```

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Visit [http://localhost:5173/](http://localhost:5173/) in your browser.

## License
MIT
