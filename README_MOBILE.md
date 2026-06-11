# Pharma Plus - Mobile App

A modern, feature-rich pharmacy mobile application built with Next.js, React, and Capacitor for Android.

## Overview

Pharma Plus is a comprehensive online pharmacy platform accessible as a native Android app. Users can:
- Browse and search pharmaceutical products
- Manage medications and prescriptions
- Place orders with secure checkout
- Track orders in real-time
- Manage user profile and preferences
- AI-powered medicine recommendations
- Health tips and wellness information

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Mobile Bridge**: Capacitor 6
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Database**: MongoDB
- **Email**: Nodemailer
- **AI**: OpenAI API
- **Payment**: Stripe
- **Platform**: Android (iOS ready with Capacitor)

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn
- Android SDK 34+
- JDK 17+

### Installation

```bash
# Clone repository
git clone https://github.com/MOJI-EDITS/pharma-project.git
cd pharma-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Configure your .env.local:
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_uri
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
```

### Building for Mobile

```bash
# Production build
npm run build

# Sync to Capacitor
npm run cap:sync

# Build Android APK
npm run android:build-debug    # Debug
npm run android:build          # Release
```

## Project Structure

```
pharma-platform/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── products/         # Product pages
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout flow
│   │   ├── orders/           # Order management
│   │   ├── profile/          # User profile
│   │   └── [other routes]/   # Additional pages
│   ├── components/           # React components
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── products/
│   │   ├── layout/
│   │   └── ai/
│   ├── lib/
│   │   ├── mongodb.ts        # Database connection
│   │   ├── email.ts          # Email sending
│   │   ├── validation.ts     # Input validation
│   │   ├── auth/             # Auth utilities
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   └── models/               # MongoDB schemas
├── public/                   # Static assets
├── android/                  # Android native code
├── capacitor.config.ts       # Capacitor configuration
├── next.config.ts            # Next.js configuration
└── package.json
```

## Key Features

### 1. Authentication System
- Email/Password signup and signin
- Google OAuth integration
- Email verification
- Password reset
- JWT-based sessions
- Role-based access (User/Admin)

### 2. Product Management
- Browse products by category
- Advanced search and filtering
- Product details with images
- Ratings and reviews
- Stock availability

### 3. Shopping Cart
- Add/remove items
- Quantity management
- Price calculation
- Wishlist functionality
- Cart persistence

### 4. Checkout & Payments
- Secure checkout process
- Stripe payment integration
- Address management
- Order confirmation
- Email receipts

### 5. Order Management
- Order history
- Order tracking
- Status updates
- Order cancellation
- Return management

### 6. User Profile
- Account information
- Address book
- Prescription history
- Wishlist
- Preferences

### 7. AI Features
- Medicine recommendations
- Symptom analysis
- Health tips
- Medication reminders

### 8. Admin Dashboard
- Product management
- Order management
- User statistics
- Prescription handling
- Analytics

## Mobile-Specific Considerations

### Responsive Design
- Mobile-first approach
- Touch-optimized UI
- Proper font sizes and spacing
- Vertical navigation
- Optimized images

### Performance
- Code splitting
- Lazy loading
- Image optimization
- CSS compression
- Bundle optimization

### Security
- HTTPS enforcement
- Secure auth tokens
- CORS configuration
- Input validation
- XSS prevention

### Offline Support
- Service workers (can be added)
- Local caching
- Graceful error handling
- Retry mechanisms

## Configuration

### Environment Variables

```env
# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database
MONGODB_URI=mongodb+srv://...

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASSWORD=

# AI & Third-party APIs
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
```

### Capacitor Configuration

```typescript
// capacitor.config.ts
export default {
  appId: 'com.futuretech.pharmaplus',
  appName: 'Pharma Plus',
  server: {
    androidScheme: 'https',
    cleartext: true  // Dev only
  },
  // ... other configs
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in (credentials)
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Verify email token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `GET /api/recommendations` - AI recommendations

### Orders
- `GET /api/orders` - User's orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Order details
- `GET /api/orders/track/[id]` - Track order

### Prescriptions
- `GET /api/prescriptions` - User's prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/history` - Prescription history

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ CSRF protection
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization
- ✅ HTTPS enforcement
- ✅ Secure session management
- ✅ Role-based access control

## Deployment

### Prerequisites
- MongoDB Atlas account
- Google Cloud credentials
- Stripe account
- Gmail/email service
- OpenAI API key

### Steps
1. See `MOBILE_DEPLOYMENT.md` for detailed instructions
2. Set up backend (Vercel, AWS, etc.)
3. Configure environment variables
4. Build APK/AAB
5. Upload to Google Play Console
6. Submit for review

## Troubleshooting

### Build Issues
```bash
# Clear cache
npm run cap:sync
cd android && ./gradlew clean

# Reinstall deps
rm -rf node_modules package-lock.json
npm install
```

### Device Connection
```bash
# List devices
adb devices

# Check connectivity
adb shell ping google.com
```

### Server Connection
- Ensure backend server is running
- Check `capacitor.config.ts` URL
- Verify network connectivity
- Check firewall settings

## Performance Optimization

- Bundle size: ~2.5 MB (debug)
- Release APK: ~15 MB
- Startup time: ~2-3 seconds
- Lighthouse score: 90+

## Browser Support
- Android 9+
- Chrome Mobile 90+

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

Proprietary - FutureTech Pharma Solutions

## Support

- Email: support@futuretech.com
- GitHub Issues: [Project Issues](https://github.com/MOJI-EDITS/pharma-project/issues)
- Documentation: See `/docs` folder

## Changelog

### Version 1.0.0 (Current)
- Initial mobile app release
- Full authentication system
- Product browsing and search
- Shopping cart and checkout
- Order management
- User profiles
- Admin dashboard
- AI recommendations

## Credits

Built by FutureTech Development Team

---

**Last Updated**: 2026-06-11  
**Current Version**: 1.0.0  
**Status**: Production Ready ✅
