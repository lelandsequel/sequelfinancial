# AmCorCo Website - Deployment Guide

## Quick Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Environment variables ready

### Step 1: Push to GitHub

```bash
cd GitHub/amcorco-redesign
git init
git add .
git commit -m "Initial commit - AmCorCo redesign"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   ```

6. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., amcorco.com)
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Environment Variables

### Required for Production

```env
# NextAuth
NEXTAUTH_URL="https://amcorco.com"
NEXTAUTH_SECRET="<your-secret-key>"

# Database (if using protected content)
DATABASE_URL="postgresql://..."

# AWS S3 (for document storage)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="amcorco-documents"

# Email
EMAIL_FROM="noreply@amcorco.com"
SENDGRID_API_KEY="..."
```

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify security headers are active
- [ ] Test contact form submission
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Test navigation and links
- [ ] Check video gallery functionality
- [ ] Verify SEO meta tags
- [ ] Test performance (Lighthouse score)
- [ ] Set up monitoring/analytics

## Performance Optimization

### Vercel Edge Network
- Automatic CDN distribution
- Edge caching enabled
- Image optimization active

### Monitoring
- Enable Vercel Analytics
- Set up error tracking (Sentry)
- Monitor Core Web Vitals

## Security Checklist

- [x] Security headers configured
- [x] CSP policy implemented
- [x] HTTPS enforced
- [x] XSS protection enabled
- [x] CSRF protection active
- [ ] Rate limiting configured (requires API setup)
- [ ] Document access authentication (requires backend)

## Rollback Plan

If issues occur:

1. In Vercel dashboard, go to "Deployments"
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

## Custom Domain Setup

### DNS Configuration

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificate

- Automatically provisioned by Vercel
- Renews automatically
- Supports wildcard domains

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Backup Strategy

- Code: GitHub (automatic)
- Database: Daily automated backups
- Documents: S3 versioning enabled

## Troubleshooting

### Build Fails

1. Check build logs in Vercel
2. Verify all dependencies are in package.json
3. Test build locally: `npm run build`

### Environment Variables Not Working

1. Ensure variables are set in Vercel dashboard
2. Redeploy after adding variables
3. Check variable names match exactly

### Performance Issues

1. Check Vercel Analytics
2. Review bundle size
3. Optimize images
4. Enable caching

## Support

For deployment issues:
- Vercel Support: https://vercel.com/support
- Documentation: https://nextjs.org/docs

For site-specific issues:
- Email: info@amcorco.com
- Phone: +1 713-349-4544

---

## Alternative: Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy

## Alternative: Self-Hosted

### Requirements
- Node.js 20+
- PM2 or similar process manager
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)

### Setup

```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "amcorco" -- start

# Configure Nginx
# See nginx.conf.example
```

---

**Estimated Deployment Time**: 5-10 minutes
**Estimated Cost**: $0/month (Vercel free tier) or $20/month (Pro tier)