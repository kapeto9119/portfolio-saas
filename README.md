# Portfolio SaaS Platform

A modern, full-stack portfolio creation platform built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL. Create and manage beautiful, customizable portfolios with ease.

## 🌟 Features

- **Multiple Portfolio Support**: Create and manage multiple portfolios under a single account
- **Custom Domains**: Use your own domain or our provided subdomain
- **Modern UI/UX**: Beautiful, responsive design with dark mode support
- **SEO Optimized**: Built-in SEO tools and meta tag management
- **Rich Content Sections**:
  - About Me
  - Projects
  - Work Experience
  - Education
  - Skills
  - Testimonials
  - Contact Information
- **Real-time Analytics**: Track portfolio views and engagement
- **Customization Options**:
  - Custom color schemes
  - Font selection
  - Layout preferences
  - Custom CSS support

## 🚀 Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components
  - Lucide Icons

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - NextAuth.js

- **Infrastructure**:
  - Docker
  - Docker Compose
  - PostgreSQL

## 📦 Prerequisites

- Node.js 18.x or later
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- pnpm (recommended) or npm

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-saas.git
   cd portfolio-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables in `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # OAuth Providers (optional)
   GITHUB_ID="your-github-id"
   GITHUB_SECRET="your-github-secret"
   ```

4. **Start the development environment**

   Using Docker:
   ```bash
   docker-compose up -d
   ```

   Without Docker:
   ```bash
   # Start the development server
   pnpm dev
   ```

5. **Run database migrations**
   ```bash
   pnpm prisma migrate dev
   ```

## 🗂️ Project Structure

```
portfolio-saas/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── [slug]/            # Dynamic portfolio routes by slug
│   ├── profile/           # User profile routes
│   │   └── [slug]/        # Dynamic user profiles
│   └── dashboard/         # Dashboard pages
├── components/            # React components
├── lib/                   # Utility functions and services
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🔒 Security

- All API routes are protected with NextAuth.js authentication
- CSRF protection enabled
- Rate limiting on API routes
- Secure password hashing
- XSS protection
- SQL injection prevention through Prisma

## 🚥 API Routes

- `GET /api/portfolio` - Get user's portfolios
- `POST /api/portfolio` - Create new portfolio
- `PUT /api/portfolio` - Update portfolio
- `DELETE /api/portfolio` - Delete portfolio

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📫 Support

For support, email support@yourplatform.com or create an issue in the repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)


