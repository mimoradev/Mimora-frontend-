# Project Context: Mimora Frontend (v2)

**Last Updated:** February 8, 2026
**Version:** 0.1.2

## 1. Project Overview

This is the frontend repository for **Mimora v2**, a modern web application built with **React 19** and **Vite**. It aims to connect Customers with Beauty Professionals (Artists). The project focuses on a premium user experience with smooth animations, modular architecture, and robust authentication.

### Key Technology Stack
-   **Framework**: React 19 + Vite 7.2
-   **Language**: TypeScript (~5.9)
-   **Styling**: Tailwind CSS v4 (@tailwindcss/vite), Framer Motion (animations)
-   **Routing**: React Router DOM v7
-   **State & Data**: React Query v5 (Server State), React Context (Client State)
-   **Authentication**: Custom Auth Service + Firebase Auth (v12) integration
-   **Icons**: Lucide React
-   **Utilities**: Lenis (Smooth Scrolling), React Phone Number Input

## 2. Architecture & Directory Structure

The project follows a standard modern React structure within `src/`:

```
d:\mimora\Mimora-Forntend-Dev\
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and local assets
│   ├── components/         # UI Components (Atomic/Feature based)
│   │   ├── auth/           # Authentication related components
│   │   │   └── views/      # Auth view components (ArtistSignupView, LoginView, etc.)
│   │   ├── common/         # Reusable UI components (PageLoader, RevealLoader)
│   │   └── landing_page/   # Specific to landing page
│   ├── config/             # Configuration files (api.ts)
│   ├── contexts/           # React Context definitions
│   ├── hooks/              # Custom React hooks (useAuthFlow, useFirebaseOAuth)
│   ├── pages/              # Route components (LandingPage, AuthPage, HomePage)
│   ├── providers/          # Context Providers wrappers
│   ├── services/           # API and Logic layer (authService.ts)
│   ├── styles/             # Global styles (imported in main.tsx)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── App.tsx                 # Main Application Layout & Routing
├── main.tsx                # Entry point
├── firebase.ts             # Firebase initialization
├── index.html              # HTML entry
└── vite.config.ts          # Vite Configuration
```

## 3. Blueprint Gap Analysis

Comparison against `MIMORA_BUILD_BLUEPRINT_CLEAN.md`

| Feature Area | Blueprint Requirement | Current Implementation Status |
| :--- | :--- | :--- |
| **Authentication** | OTP (Email/Phone), Google OAuth, JWT | ✅ **Mostly Done**. Supports Phone, Email, Google Auth. Integration with Firebase & Backend exists. |
| **Artist Onboarding** | Profile Creation, Portfolio, KYC (DigiLocker/Face), Bank Details | 🚧 **In Progress**. Artist Signup View with 4-step onboarding flow (Personal Details, Booking Modes, Portfolio, Bank Details). Step 1 implemented. |
| **Customer Discovery** | Geo-search, Filters (Price/Rating), Artist Profiles | ❌ **Missing**. No Search, Map, or Artist Profile pages. |
| **Booking System** | Instant/Flexi Booking, State Machine, Payments | ❌ **Missing**. No Booking flow, no selection of dates/packages. |
| **Payments** | Razorpay Integration, Escrow, Refunds | ❌ **Missing**. No Payment gateway integration. |
| **Communication** | Real-time Chat (WebSocket), Notifications | ❌ **Missing**. No Chat system. |
| **Journey Tracking** | Live Map, Artist Tracking, SOS | ❌ **Missing**. No Maps or Tracking. |
| **Dashboard** | User/Artist Dashboards, Admin Panel | 🚧 **In Progress**. `HomePage` is a placeholder. No real dashboard features. |

## 4. Current Implementation Status

### 🎨 Artist Features
**Status:** 🚧 In Development (~25%)

*   **Authentication**:
    *   **Selection**: Artists can select their profile type on the Auth Landing page.
    *   **Signup Flow**: Dedicated `ArtistSignupView` with multi-step onboarding.
*   **Artist Signup View** (`src/components/auth/views/ArtistSignupView.tsx`):
    *   **4-Step Onboarding UI**: Personal Details → Booking Modes → Portfolio → Bank Details
    *   **Step 1 (Personal Details)**: Fully implemented with form fields for name, phone, email, birthday, gender, experience, and bio.
    *   **Layout**: 70/30 split layout with form on left and Profile Preview on right.
    *   **Lenis Smooth Scroll**: Custom Lenis instance for smooth scrolling within the form section using `scrollContainerRef` and `contentRef`.
    *   **Multi-auth Support**: Phone OTP, Email OTP, and Google OAuth signup methods.
*   **Missing**: Steps 2-4 (Booking Modes, Portfolio, Bank Details), Backend integration for saving data.

### 👤 Customer Features
**Status:** 🔨 In Progress (~40%)

*   **Authentication**:
    *   **Selection**: Customers can select their profile type.
    *   **Signup Flow**: robust implementation (Phone, Email, Google).
    *   **Login**: Dedicated `LoginView` exists.
*   **Missing**: Search, Booking, Profile Management.

## 5. Core Systems Implementation

### Authentication
-   **Hybrid Approach**: Uses Firebase Auth for identity verification (OAuth/OTP) and a custom backend for session/user management.
-   **Service Layer**: `authService.ts` handles communication with the backend.
-   **Flow**: Firebase Token -> Backend -> Session.

### Routing
-   **React Router v7**: Configured in `App.tsx`.
-   **Routes**:
    -   `/`: `LandingPage`
    -   `/auth`: `AuthPage`
    -   `/auth/artist/signup`: `ArtistSignupView`
    -   `/auth/artist/login`: Artist Login
    -   `/auth/customer/signup`: Customer Signup
    -   `/auth/customer/login`: Customer Login
    -   `/home`: `HomePage` (Placeholder)

### Styling & Design System
-   **Tailwind CSS v4**: Configured via Vite plugin.
-   **Global Styles**: `src/index.css` defines root variables and animations.
-   **Note**: Use `bg-linear-to-b` instead of deprecated `bg-gradient-to-b` for gradients.

### Smooth Scrolling (Lenis)
-   **Global Instance**: Configured in `App.tsx` for page-level smooth scrolling.
-   **Nested Scroll Containers**: Use dedicated Lenis instances with `wrapper` and `content` refs for nested scrollable sections (e.g., `ArtistSignupView` form section).

## 6. Maintenance Notes
**Rule:** This file (`context.md`) must be updated after any significant architectural change, dependency addition, or major feature implementation to maintain an accurate mental model of the codebase.

### Recent Changes (February 8, 2026)
-   **ArtistSignupView**: Fixed JSX structure, implemented 70/30 layout with Profile Preview, added Lenis smooth scroll for form section.
-   **Layout Fix**: Profile Preview section now correctly positioned as sibling of form section (was incorrectly nested).
-   **Lenis Integration**: Added `scrollContainerRef` and `contentRef` for proper nested Lenis scroll handling.
