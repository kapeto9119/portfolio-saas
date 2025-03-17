# Portfolio SaaS: Modern Portfolio Builder

A feature-rich SaaS application that allows users to create and manage professional portfolios with ease. Built with modern technologies and best practices.

## Features

- 🌙 **Dark/Light Mode** - Full theme support with automatic detection
- 🔐 **Authentication** - Complete auth flow with NextAuth.js (email/password, Google, GitHub)
- 📱 **Responsive Design** - Optimized for all screen sizes
- 📝 **Portfolio Editor** - Intuitive interface to create and edit portfolio content
- 📊 **Dashboard** - Analytics and statistics on portfolio views
- 🖼️ **Modern UI** - Clean and professional user interface
- 🔒 **Secure** - Built with security best practices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React hooks and contexts
- **Styling**: Tailwind CSS with CSS variables for theming
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-saas.git
   cd portfolio-saas
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database URL and auth providers

5. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. Visit `http://localhost:3000` to see the application

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/             # API Routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard pages
│   └── ...
├── components/          # React components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── ui/              # UI components
│   └── ...
├── lib/                 # Utility functions and shared code
│   ├── auth.ts          # Authentication configuration
│   ├── db.ts            # Database client
│   └── utils.ts         # Utility functions
└── ...
```

## Environment Variables

The following environment variables are required:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_saas"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
```

## Deployment

This project can be deployed on Vercel, Netlify, or any other Next.js-compatible hosting service.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Import your project to Vercel
3. Set up environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)


