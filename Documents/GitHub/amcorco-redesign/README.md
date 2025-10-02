# AmCorCo Website Redesign

Modern, secure, and beautiful website for American Conservation Oil Remediation Co. USA.

## 🚀 Features

- ✅ **Modern Design**: Beautiful UI with Tailwind CSS and Framer Motion animations
- ✅ **Secure by Default**: Comprehensive security headers and CSP policies
- ✅ **Protected Documents**: Authentication-required access to SDS and technical documents
- ✅ **Responsive**: Mobile-first design that works on all devices
- ✅ **Performance Optimized**: Fast loading with Next.js 14 and image optimization
- ✅ **SEO Optimized**: Built-in SEO with proper meta tags and structured data
- ✅ **Accessible**: WCAG 2.1 compliant

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL + Prisma
- **File Storage**: AWS S3

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd amcorco-redesign
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Features

### Implemented Security Measures

1. **Security Headers**
   - Strict-Transport-Security (HSTS)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Content-Security-Policy
   - Referrer-Policy
   - Permissions-Policy

2. **Document Protection**
   - Authentication required for SDS access
   - Time-limited signed URLs (15-30 min)
   - Access logging and tracking
   - Rate limiting on downloads

3. **Form Security**
   - CSRF protection
   - Input validation and sanitization
   - Rate limiting on submissions
   - reCAPTCHA integration

4. **API Security**
   - JWT authentication
   - Rate limiting
   - Input validation
   - SQL injection prevention

## 📁 Project Structure

```
amcorco-redesign/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Navigation & Footer
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── about/             # About page
│   ├── products/          # Products page
│   ├── applications/      # Applications page
│   ├── contact/           # Contact page
│   ├── portal/            # Protected portal
│   └── api/               # API routes
├── components/            # React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── ProductShowcase.tsx
│   ├── HowItWorks.tsx
│   ├── Applications.tsx
│   ├── VideoGallery.tsx
│   └── ContactCTA.tsx
├── lib/                   # Utility functions
├── public/                # Static assets
└── prisma/                # Database schema
```

## 🎨 Design System

### Colors
- **Primary**: Teal (#1E5A6E) - Professional, Environmental
- **Secondary**: Orange (#F97316) - Energy, Action
- **Accent**: Green (#10B981) - Eco-friendly, Growth

### Typography
- **Headings**: Inter (Bold)
- **Body**: Inter (Regular)
- **Display**: Space Grotesk

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

```bash
npm run build
```

### Environment Variables Required

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `SENDGRID_API_KEY`

## 📝 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Adding New Pages

1. Create a new directory in `app/`
2. Add `page.tsx` for the route
3. Add `layout.tsx` if needed
4. Update navigation in `components/Navigation.tsx`

### Adding New Components

1. Create component in `components/`
2. Use TypeScript for type safety
3. Follow existing naming conventions
4. Add Framer Motion animations where appropriate

## 🔐 Protected Content Setup

### Setting Up Document Protection

1. **Configure AWS S3**:
   - Create S3 bucket
   - Set up IAM user with S3 access
   - Configure CORS policy

2. **Set Up Authentication**:
   - Configure NextAuth.js
   - Set up user roles (user, verified, admin)
   - Implement access control

3. **Upload Documents**:
   - Use admin dashboard to upload SDS
   - Set access permissions
   - Generate signed URLs

## 📊 Analytics

The site includes:
- Vercel Analytics (built-in)
- Custom event tracking
- Form submission tracking
- Video engagement tracking

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**:
   - Clear `.next` folder: `rm -rf .next`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

2. **Environment Variables**:
   - Ensure all required variables are set
   - Restart dev server after changes

3. **Database Issues**:
   - Run migrations: `npx prisma migrate dev`
   - Reset database: `npx prisma migrate reset`

## 📄 License

Proprietary - American Conservation Oil Remediation Co. USA

## 🤝 Support

For support, email info@amcorco.com or call +1 713-349-4544

---

Built with ❤️ for a cleaner environment
