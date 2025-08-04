# RuralConnect - Rural Community Platform

A comprehensive full-stack web application designed to connect rural communities with essential products and services. Built to bridge the gap between rural areas and modern convenience through easy ordering, reliable delivery, and community-focused support.

![RuralConnect Platform](https://img.shields.io/badge/Platform-Rural%20Community-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![Deadline](https://img.shields.io/badge/Deadline-August%207,%202025-blue?style=for-the-badge)

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **TailwindCSS 3** - Utility-first CSS framework for rapid UI development
- **React Router 6** - Client-side routing with SPA mode
- **Radix UI + shadcn/ui** - Accessible UI component library
- **Lucide React** - Beautiful, customizable SVG icons
- **React Query** - Data fetching and state management
- **React Hook Form** - Performant forms with easy validation

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe server-side development
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

### Development Tools
- **Vitest** - Fast unit testing framework
- **ESLint + Prettier** - Code linting and formatting
- **Git** - Version control with automatic commits
- **Hot Module Replacement** - Fast development with instant updates

### Design System
- **Custom CSS Variables** - Consistent theming with dark/light mode
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Modern UI Patterns** - Cards, modals, notifications, and more

## 🏃‍♂️ How to Run the App Locally

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ruralconnect-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file (optional - app works with defaults)
   cp .env.example .env
   
   # Edit .env with your configurations
   PING_MESSAGE="Hello from RuralConnect"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - The app will automatically reload when you make changes

### Available Scripts

```bash
npm run dev        # Start development server (client + server)
npm run build      # Production build for both client and server
npm run start      # Start production server
npm run test       # Run Vitest tests
npm run typecheck  # TypeScript validation
npm run format.fix # Format code with Prettier
```

### Development Workflow
- The app runs on a single port (8080) with both frontend and backend
- Hot reload is enabled for both client and server code
- API endpoints are prefixed with `/api/`
- TypeScript compilation happens in real-time

## ✨ Features Covered

### 🛍️ E-commerce Core Features
- **Product Catalog**: Browse 10+ essential products with detailed information
- **Advanced Search & Filtering**: Category filters, price range, ratings, and text search
- **Product Details**: Comprehensive product pages with multiple images, specifications, and reviews
- **Shopping Cart**: Real-time cart management with quantity controls and persistence
- **Wishlist**: Save favorite products for later purchase
- **Checkout Flow**: Multi-step checkout with address management and payment options
- **Order Management**: Order history, tracking, and status updates

### 👤 User Management
- **User Authentication**: Secure signup/login with token-based authentication
- **User Dashboard**: Personalized dashboard with profile management and order history
- **Profile Management**: Update personal information, addresses, and preferences
- **Account Statistics**: Track orders, wishlist items, and account activity

### 🌾 Farmer-Specific Features
- **Weather Dashboard**: 7-day weather forecast with farming tips
- **Market Price Tracker**: Real-time market prices for agricultural products
- **Price Trends**: Historical price data and change indicators
- **Farming Tips**: Weather-based agricultural advice and recommendations
- **Agricultural Products**: Specialized farming tools, seeds, and equipment

### 🎨 User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: System-wide theme switching with persistence
- **Real-time Notifications**: Cart updates, price alerts, and status messages
- **Progressive UI**: Loading states, error handling, and smooth transitions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 🔧 Technical Features
- **RESTful APIs**: Comprehensive backend APIs for all functionality
- **Data Validation**: Input validation with Zod schemas
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance**: Optimized loading with lazy loading and code splitting
- **SEO Ready**: Meta tags, semantic HTML, and structured data

### 📊 Business Features
- **Service Catalog**: 5 main services (Grocery, Medicine, Farm Equipment, Repair, Education)
- **Community Reviews**: User-generated reviews with ratings and verification
- **Contact System**: Contact forms with automatic email handling
- **News & Updates**: Community news and announcements
- **Multiple Payment Methods**: Cash on Delivery, Credit/Debit Cards, UPI

## 🔐 Demo Login Credentials

For testing purposes, you can use the following demo account:

**Demo User Account:**
- **Email**: `demo@ruralconnect.com`
- **Password**: `demo123`

**Features Available with Demo Account:**
- Access to user dashboard
- Order history viewing
- Profile management
- Wishlist functionality
- Full shopping cart and checkout flow
- Review submission and management

**Guest Features (No Login Required):**
- Browse all products and services
- View product details and reviews
- Use search and filtering
- Access farmer dashboard with weather and market prices
- Contact form submission
- News and updates

**Test Data Available:**
- **Products**: 10+ products across categories (Grocery, Medicine, Tools, Agriculture)
- **Reviews**: Sample product reviews with ratings
- **Market Prices**: 8 market price entries with trend data
- **Weather Data**: 7-day weather forecast with farming tips
- **News Items**: 5 community news articles

## 🎯 Target Audience

- **Rural Communities**: Farmers and rural residents seeking access to essential products
- **Agricultural Workers**: Professionals needing farming tools and market information
- **Small Business Owners**: Rural entrepreneurs looking for supplies and services
- **Healthcare Seekers**: Individuals needing access to medicines and medical supplies
- **Families**: Households requiring grocery delivery and essential services

## 🚀 Deployment

The application is production-ready and can be deployed using:

### Recommended Deployment Options
1. **Netlify** (Frontend + Serverless Functions)
2. **Vercel** (Full-stack deployment)
3. **Traditional VPS** (Using npm start)
4. **Docker** (Containerized deployment)

### Production Build
```bash
npm run build    # Creates optimized production build
npm run start    # Starts production server
```

## 📈 Future Enhancements

- **Real-time Chat**: Customer support and community chat
- **Mobile App**: React Native mobile application
- **Payment Gateway**: Integration with Indian payment systems (Razorpay, Paytm)
- **Inventory Management**: Real-time stock tracking
- **Delivery Tracking**: GPS-based order tracking
- **Multi-language Support**: Local language support
- **AI Recommendations**: Personalized product suggestions
- **Blockchain Integration**: Supply chain transparency

## 🤝 Contributing

This project is designed for rural community empowerment. Contributions are welcome for:
- Bug fixes and improvements
- New feature development
- UI/UX enhancements
- Performance optimizations
- Documentation updates

## 📄 License

This project is developed for educational and community purposes. Built with ❤️ for rural communities.

---

**Project Deadline**: August 7, 2025  
**Status**: Production Ready  
**Last Updated**: January 2024

For support or questions, please use the contact form in the application or reach out to the development team.
