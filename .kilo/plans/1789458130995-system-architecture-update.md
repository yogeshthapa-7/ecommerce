# 1789458130995-system-architecture-update.md

## Presentation Layer (Frontend)

The frontend was built with Next.js using the App Router, React, and TypeScript. It handles all user interactions and renders dynamic interfaces. Tailwind CSS is used for styling. The frontend communicates with the backend through RESTful API endpoints. Key features include responsive layouts, form validation with Formik and Yup, data fetching with SWR, and client-side state management for cart and wishlist.

## Application Layer (Backend)

The backend was built with Node.js and Express.js. It handles all business logic, processes API requests, manages authentication and authorization, and coordinates data operations. The codebase follows a modular structure with separate route handlers, controllers, models, and middleware. Authentication is handled with JWT and bcrypt. Middleware enforces role-based access control and protects sensitive routes.

## Data Layer (Database)

MongoDB was used as the primary database, with Mongoose as the ODM. The database schema includes models for User, Product, Order, Cart, Wishlist, Category, Customer, Cancellation, Return, Exchange, StockLog, and AuditLog. Indexes were applied where appropriate to support efficient queries. Meilisearch was integrated for fast full-text product search.

## External Services

The system integrates with third-party services for notifications: Nodemailer for email delivery and Twilio for SMS notifications. The AI shopping assistant uses the Groq API for product recommendations.
