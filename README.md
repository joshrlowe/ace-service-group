# Ace Service Group LLC - Website

A professional marketing website with admin CMS for Ace Service Group LLC, a construction company based in Lansdale, PA.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS v4
- **Database**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (Auth.js) with Credentials provider
- **File Uploads**: Vercel Blob
- **Validation**: Zod
- **Deployment**: Vercel

## Features

### Public Website
- **Home** - Hero section, featured services, featured projects, CTA
- **Services** - List of all services with descriptions
- **Projects/Gallery** - Portfolio with category filtering
- **About** - Company information and values
- **Contact** - Contact form with rate limiting

### Admin Dashboard (`/admin`)
- **Authentication** - Secure login with session management
- **Dashboard** - Stats overview and quick actions
- **Projects CRUD** - Create, edit, delete portfolio projects with multiple images
- **Site Settings** - Edit all website content (hero, about, contact info, social links)
- **Services Manager** - Add, edit, remove services
- **Contact Submissions** - View, manage, and respond to form submissions

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Vercel Postgres)
- Vercel account (for Blob storage)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd ace-service-group
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL="postgres://..."
   DATABASE_URL_UNPOOLED="postgres://..."

   # Auth
   AUTH_SECRET="generate-with-openssl-rand-base64-32"
   AUTH_URL="http://localhost:3000"

   # Admin seed
   ADMIN_EMAIL="your-email@example.com"
   ADMIN_PASSWORD="your-secure-password"
   ADMIN_NAME="Your Name"

   # Vercel Blob
   BLOB_READ_WRITE_TOKEN="vercel_blob_..."
   ```

3. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push

   # Seed admin user and default data
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the site**
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## Deployment to Vercel

### 1. Create Vercel Project
```bash
vercel
```

### 2. Set up Vercel Postgres
1. Go to Vercel Dashboard → Storage → Create Database → Postgres
2. Connect the database to your project
3. The `DATABASE_URL` and `DATABASE_URL_UNPOOLED` will be automatically added

### 3. Set up Vercel Blob
1. Go to Vercel Dashboard → Storage → Create Store → Blob
2. Connect to your project
3. The `BLOB_READ_WRITE_TOKEN` will be automatically added

### 4. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
- `AUTH_SECRET` - Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password
- `ADMIN_NAME` - Admin display name

### 5. Deploy
```bash
vercel --prod
```

### 6. Run Database Setup
After first deployment, run migrations and seed:
```bash
# Using Vercel CLI
vercel env pull .env.local
npm run db:push
npm run db:seed
```

Or use Vercel's build command to auto-migrate:
- Build Command: `prisma generate && prisma db push && next build`

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/
│   │   ├── (public)/      # Public routes (home, services, etc.)
│   │   ├── admin/         # Admin dashboard routes
│   │   ├── api/           # API routes
│   │   └── actions/       # Server actions
│   ├── components/
│   │   ├── admin/         # Admin components
│   │   ├── public/        # Public site components
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # Prisma client
│   │   ├── data.ts        # Data fetching utilities
│   │   ├── utils.ts       # Utility functions
│   │   └── validations.ts # Zod schemas
│   └── types/             # TypeScript type definitions
├── .env.example           # Environment variables template
└── README.md
```

## Database Schema

- **User** - Admin authentication
- **Project** - Portfolio projects
- **ProjectImage** - Multiple images per project
- **Service** - Services offered
- **SiteSettings** - Editable site content
- **ContactSubmission** - Contact form submissions
- **RateLimit** - Rate limiting for forms

## Security

- Server-side authentication protection on all admin routes
- Zod validation on all form inputs
- Rate limiting on contact form (5 submissions/hour per IP)
- Passwords hashed with bcrypt
- CSRF protection via NextAuth
- All secrets in environment variables

## Admin Workflow

### Adding a New Project
1. Login at `/admin/login`
2. Go to Dashboard → Projects → "Add Project"
3. Fill in project details
4. Upload images or add image URLs
5. Set as Featured if desired
6. Save → Project appears on public site

### Editing Site Content
1. Go to Dashboard → Settings
2. Edit business info, contact, hero section, about page
3. Manage services in the Services section
4. Save changes → Site updates immediately

### Managing Contact Submissions
1. Go to Dashboard → Submissions
2. View new submissions (marked with "New" badge)
3. Add internal notes
4. Mark as handled when complete
5. Use quick actions to email or call

## Assumptions / Placeholders

The following are placeholders that should be customized:

1. **Hero Image** - No default hero background image; add via Settings
2. **Project Images** - No sample project images included
3. **Social Media Links** - Set in Settings if available
4. **Street Address** - Not included (only service area shown)
5. **Business Licenses/Certifications** - Not claimed (none provided)
6. **Testimonials** - Not included (insufficient social proof data)
7. **Pricing** - Not displayed (no pricing information provided)

## License

Private - All rights reserved.

---

Built for Ace Service Group LLC | Lansdale, PA
