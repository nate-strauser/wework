# WeWork Meteor - Architecture & Features Documentation

## Overview

WeWork Meteor is a specialized job board application built for the Meteor.js community. It allows companies to post Meteor-specific job opportunities and was originally designed to include a developer directory feature (currently disabled in the UI but infrastructure remains).

**Live Site**: https://www.weworkmeteor.com/

## Technology Stack

- **Framework**: Meteor 2.7.1
- **Runtime**: Node.js 8.11.4
- **Database**: MongoDB (via Meteor's integrated Mongo)
- **UI Framework**: Bootstrap 3 with custom Journal theme
- **Templating**: Blaze
- **Routing**: Iron Router
- **Form Handling**: AutoForm with Collection2 schemas
- **Authentication**: Meteor Accounts with OAuth support

## Application Architecture

### Directory Structure

```
/both/           # Shared code between client and server
  ├── collections/    # MongoDB collections and schemas
  ├── lib/           # Constants, helpers, methods
/client/         # Client-side code
  ├── views/         # Blaze templates organized by feature
  ├── lib/           # Client-specific libraries and styles
/server/         # Server-side code
  ├── publications.js # Data publications
  ├── methods.js     # Server methods
  ├── api.js         # REST API endpoints
  ├── hooks.js       # Collection hooks
  └── cron.js        # Scheduled tasks
/public/         # Static assets
/router.js       # Route definitions
```

## Core Features

### 1. Job Posting System

**Data Model** (`Jobs` collection):
- Title, company, location, URL
- Job type (Full Time, Part Time, Contract, etc.)
- Remote position flag
- Rich text description (Summernote editor)
- Contact information
- Status workflow: `pending` → `active` → `filled`/`inactive`
- Auto-expiration after 90 days

**Key Features**:
- Admin approval required for new posts
- SEO-friendly URLs with slugs
- Featured job listings (paid via Stripe)
- HTML sanitization for security

### 2. Featured Jobs

- Jobs can be promoted as "featured" with payment
- Stripe integration for payment processing
- Featured status with expiration date (`featuredThrough`)
- Prominent display on homepage

### 3. Authentication & Authorization

**OAuth Providers Supported**:
- GitHub
- Google
- Facebook (disabled)
- Twitter (disabled)
- Meteor Developer (disabled)

**Roles**:
- Regular users can post/edit their own jobs
- Admins can moderate all content
- Role-based access using `alanning:roles` package

### 4. REST API

**Endpoints**:
- `GET /api/jobs` - Returns all active jobs
- `GET /api/featuredJobs` - Returns featured jobs

**Features**:
- Excludes sensitive fields (userId, userName)
- Includes generated site URLs
- JSON response format

### 5. Developer Directory (Infrastructure Only)

While the UI is disabled, the backend supports:
- Individual and company profiles
- Skills and availability tracking
- Portfolio links (GitHub, LinkedIn, Stack Overflow)
- Full-text search on profiles
- Random ordering for fair visibility

## Key Technical Features

### Data Validation
- SimpleSchema for collection schemas
- AutoForm for automatic form generation
- Client and server-side validation

### Performance Optimizations
- Field limiting in publications
- Subscription caching with `SubsManager`
- Indexes on searchable fields

### SEO & Discovery
- Sitemap generation (`gadicohen:sitemaps`)
- RSS feed support (`lampe:rssfeed`)
- SEO-friendly URLs with slugs

### Security
- HTML sanitization with `djedi:sanitize-html`
- Force SSL in production
- Secure collection hooks
- Permission checks on all mutations

## Third-Party Integrations

1. **Stripe** - Payment processing for featured jobs
2. **Uploadcare** - File upload service
3. **Kadira** - Performance monitoring (legacy)
4. **Astronomer** - Analytics tracking

## Configuration

The app requires a `settings.json` file with:
- Uploadcare public key
- Stripe publishable and secret keys
- Optional: Kadira and Astronomer credentials

## Workflow Examples

### Job Posting Flow
1. User creates account (via OAuth or email)
2. User submits job posting
3. Job starts in `pending` status
4. Admin receives email notification
5. Admin approves → job becomes `active`
6. Job appears on site for 90 days
7. Auto-expires or user marks as `filled`

### Featured Job Flow
1. User with active/pending job clicks "Feature"
2. Stripe payment form appears
3. Payment processed
4. Job gets `featuredThrough` date
5. Job appears in featured section

## Development Considerations

### Current State
- Profile/developer features are disabled in UI
- Focus is solely on job postings
- Mobile-responsive design
- Bootstrap Journal theme for styling

### Extension Points
- Profile system can be re-enabled
- Additional OAuth providers can be added
- API can be extended for more endpoints
- Email templates can be customized

### Deployment
- Designed for Galaxy deployment
- SSL required in production
- Settings file needed for configuration
- Compatible with standard Meteor hosting

## Commands

```bash
# Install dependencies
meteor npm install

# Run locally
meteor --settings dev_settings.json

# Run linting
npm run lint
```

## Notes for Development

1. The codebase follows standard Meteor patterns
2. Collections use allow/deny rules with additional method security
3. Profile functionality exists in backend but is commented out in routes
4. Email notifications require SMTP configuration
5. Job expiration is handled via publication filters (90 days)