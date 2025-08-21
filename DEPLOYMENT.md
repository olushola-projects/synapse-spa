# Vercel Deployment Guide - Synapse Landing Page

## 🚀 Production Deployment Checklist

### Pre-Deployment Requirements

#### 1. Environment Variables Setup
Configure the following environment variables in Vercel Dashboard:

**Required Variables:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_POSTHOG_KEY` - PostHog analytics key
- `VITE_POSTHOG_HOST` - PostHog host (default: https://app.posthog.com)
- `VITE_OPENAI_API_KEY` - OpenAI API key for AI features
- `VITE_NEXUS_API_KEY` - Nexus API key

**Optional Variables:**
- `VITE_APP_ENV=production`
- `VITE_APP_URL` - Your production domain
- `VITE_API_BASE_URL` - API base URL
- `VITE_ENABLE_ANALYTICS=true`
- `VITE_ENABLE_ERROR_REPORTING=true`

#### 2. Security Configuration

✅ **Security Headers Configured** (via vercel.json)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

✅ **Asset Caching Optimized**
- Static assets cached for 1 year
- Immutable cache headers for versioned assets

#### 3. Performance Optimizations

✅ **Build Optimizations**
- Code splitting enabled
- Tree shaking configured
- Asset optimization with proper naming
- Bundle analysis available via `npm run build:analyze`

✅ **Chunk Strategy**
- Vendor chunks (React, React DOM)
- UI components chunk (Radix UI)
- Router chunk (React Router)
- Utilities chunk (Tailwind, date-fns)
- Analytics chunk (PostHog)
- Authentication chunk (Supabase)
- Forms chunk (React Hook Form, Zod)
- Animations chunk (Framer Motion)

### Deployment Steps

#### Option 1: Vercel CLI Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Preview**
   ```bash
   npm run deploy:preview
   ```

4. **Deploy to Production**
   ```bash
   npm run deploy:prod
   ```

#### Option 2: GitHub Integration

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run vercel:build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables listed above

### Post-Deployment Verification

#### 1. Functional Testing
- [ ] Homepage loads correctly
- [ ] All routes work (SPA routing)
- [ ] Authentication flow works
- [ ] API integrations functional
- [ ] Forms submit correctly
- [ ] Analytics tracking active

#### 2. Performance Testing
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Bundle size < 1MB
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

#### 3. Security Testing
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No console errors in production
- [ ] Environment variables not exposed
- [ ] CSP headers configured (if needed)

### Monitoring & Maintenance

#### 1. Analytics Setup
- PostHog analytics configured
- Error tracking enabled
- Performance monitoring active

#### 2. Regular Maintenance
- Monitor bundle size growth
- Update dependencies monthly
- Review security headers quarterly
- Performance audits monthly

### Troubleshooting

#### Common Issues

**1. Build Failures**
```bash
# Check build locally
npm run build:prod

# Run quality checks
npm run quality:check
```

**2. Routing Issues**
- Ensure `vercel.json` has correct SPA routing configuration
- Check for case-sensitive route issues

**3. Environment Variables**
- Verify all VITE_ prefixed variables are set
- Check variable names match exactly

**4. Performance Issues**
```bash
# Analyze bundle
npm run build:analyze

# Check chunk sizes
npm run preview:prod
```

### Production URLs

- **Production**: `https://your-domain.vercel.app`
- **Preview**: Auto-generated for each PR
- **Analytics**: PostHog Dashboard
- **Monitoring**: Vercel Analytics

### Support

For deployment issues:
1. Check Vercel build logs
2. Review this deployment guide
3. Check environment variable configuration
4. Verify all dependencies are properly installed

---

**Last Updated**: $(date)
**Deployment Version**: v1.0.0
**Framework**: Vite + React + TypeScript
**Platform**: Vercel