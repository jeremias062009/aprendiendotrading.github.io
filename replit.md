# Overview

This is a comprehensive trading education platform built with React/TypeScript frontend and Express/Node.js backend. The application provides interactive eBooks, platform tutorials, real-time market data, and AI-powered trading strategies to help users learn cryptocurrency trading from beginner to advanced levels.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: Zustand for admin authentication state, TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Real-time Communication**: WebSocket implementation for live market data streaming

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time Data**: WebSocket server for streaming market data from Binance API
- **AI Integration**: OpenRouter API integration for market analysis and trading signal generation
- **Session Management**: Express sessions with PostgreSQL store

## Database Design
The system uses four main entities:
- **Admin Users**: Authentication for content management
- **eBooks**: Interactive educational content with JSON-based rich content structure
- **Tutorials**: Platform-specific step-by-step guides (Binance/BingX)
- **AI Strategies**: Generated trading signals and market analysis
- **Market Data**: Real-time cryptocurrency price and volume data

## Authentication & Authorization
- Admin-only content management system with email/password authentication
- Hardcoded admin credentials for two authorized users
- Session-based authentication with persistent storage
- Public content access with admin-gated management features

## Content Management
- Admin panel for CRUD operations on eBooks and tutorials
- Rich content support through JSON structure for flexible formatting
- Publication status controls for content visibility
- Category-based organization (basics/intermediate/advanced)

## Real-time Features
- WebSocket integration with Binance API for live cryptocurrency data
- Real-time price charts and market indicators
- Live trading data streams with connection status monitoring
- Automatic reconnection handling for WebSocket connections

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL serverless database hosting
- **Drizzle Kit**: Database schema management and migrations

## Market Data APIs
- **Binance WebSocket API**: Real-time cryptocurrency market data streaming
- **Binance REST API**: Historical market data and exchange information

## AI/ML Services  
- **OpenRouter API**: AI-powered market analysis and trading signal generation
- **Various LLM Models**: Accessible through OpenRouter for market sentiment analysis

## UI/UX Libraries
- **shadcn/ui**: Pre-built React component library
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide Icons**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

## Hosting & Deployment
- **Replit**: Development environment and hosting platform
- **WebSocket Support**: Real-time communication infrastructure
- **Static Asset Serving**: Vite-based asset optimization and serving