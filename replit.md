# Overview

Transacker is a full-stack transaction management application built with React and Express. The app allows users to record and track financial transactions, specifically designed for credit transactions (like weekly payments and diamond purchases) and debit transactions (like eSewa and bank transfers). It features a modern dark-themed UI with transaction creation, history viewing, and monthly profit tracking capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom dark theme and CSS variables
- **State Management**: TanStack React Query for server state and forms with React Hook Form
- **Routing**: Wouter for lightweight client-side routing
- **Form Validation**: Zod schemas with React Hook Form resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Data Storage**: In-memory storage using Map data structure (MemStorage class)
- **Validation**: Zod schemas shared between client and server
- **Development**: Hot module replacement via Vite integration

## Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Single `transactions` table with fields for:
  - Transaction type (credit/debit)
  - Sub-type (Weekly, diamond amounts, eSewa, bank)
  - Financial data (amount, rate, profit, quantity)
  - Indexing for credit transactions
  - Timestamps for creation tracking

## Authentication & Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic session middleware configured but not utilized

## Key Design Patterns
- **Shared Types**: Common TypeScript interfaces and Zod schemas in shared directory
- **Component Composition**: Reusable UI components with variant-based styling
- **Error Handling**: Centralized error handling in Express middleware
- **Form Management**: Type-safe forms with automatic validation
- **Responsive Design**: Mobile-first approach with floating action buttons

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection (configured but using in-memory storage)
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **express**: Web framework for the backend API
- **vite**: Frontend build tool and development server

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

## State Management & Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **typescript**: Type safety across the entire application
- **zod**: Runtime type validation and schema definition

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **nanoid**: Unique ID generation for development logging