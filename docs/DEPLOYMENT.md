# Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the Product Catalog UI to various platforms and environments. The application is built with Bun and can be deployed as a static site or as a full-stack application with the included API server.

## 📦 Build Process

### Production Build

The project includes a sophisticated build system that generates optimized assets:

```bash
# Standard production build
bun run build

# Custom build with options
bun run build --minify --source-map=linked --outdir=dist
```

### Build Output

The build process:
1. Scans for HTML files in `src/`
2. Bundles JavaScript/TypeScript with Bun
3. Processes Tailwind CSS
4. Outputs to `dist/` directory (configurable)
5. Generates source maps for debugging

### Build Customization

The build script supports extensive CLI options:

```bash
# See all available options
bun run build --help

# Common configurations
bun run build --outdir=public --minify --target=browser
bun run build --source-map=external --packages=external
bun run build --define.VERSION=1.0.0 --banner="/* Product Catalog v1.0.0 */"
```

## 🌐 Deployment Options

### Option 1: Static Site Hosting

Deploy as a static site to platforms like Netlify, Vercel, or GitHub Pages.

#### Netlify

1. **Build Settings:**
   - Build command: `bun run build`
   - Publish directory: `dist`
   - Node version: Latest (Bun compatible)

2. **netlify.toml** (optional):
```toml
[build]
  command = "bun run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

1. **vercel.json:**
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
          
      - name: Install dependencies
        run: bun install
        
      - name: Build
        run: bun run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 2: Full-Stack Deployment

Deploy the complete application with both frontend and API server.

#### Docker Deployment

1. **Dockerfile:**
```dockerfile
FROM oven/bun:1 as builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:1 as runtime

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/index.tsx ./
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["bun", "start"]
```

2. **docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Railway

1. Connect GitHub repository to Railway
2. Set build command: `bun run build`
3. Set start command: `bun start`
4. Configure environment variables
5. Deploy automatically on push

#### Fly.io

1. **fly.toml:**
```toml
app = "product-catalog-ui"
primary_region = "sea"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

2. Deploy:
```bash
fly deploy
```

### Option 3: VPS/Server Deployment

For traditional server deployment:

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
bun run build

# Start with PM2
pm2 start bun --name "product-catalog" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Using systemd

1. **Create service file** `/etc/systemd/system/product-catalog.service`:
```ini
[Unit]
Description=Product Catalog UI
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/product-catalog-ui
ExecStart=/usr/local/bin/bun start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

2. **Enable and start:**
```bash
sudo systemctl enable product-catalog
sudo systemctl start product-catalog
```

## 🔒 Production Configuration

### Environment Variables

Create a `.env.production` file:

```bash
NODE_ENV=production
PORT=3000
API_BASE_URL=https://yourdomain.com/api

# Database (when implemented)
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication (when implemented)
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# External Services
STRIPE_SECRET_KEY=sk_live_...
CLOUDINARY_URL=cloudinary://...
```

### Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to repository
3. **CORS**: Configure proper CORS settings
4. **Rate Limiting**: Implement API rate limiting
5. **Input Validation**: Validate all user inputs
6. **CSP Headers**: Set Content Security Policy headers

### Performance Optimization

1. **CDN**: Use a CDN for static assets
2. **Compression**: Enable gzip/brotli compression
3. **Caching**: Set proper cache headers
4. **Image Optimization**: Compress and resize images
5. **Bundle Analysis**: Monitor bundle size

## 📊 Monitoring & Logging

### Health Check Endpoint

The application includes a basic health check:

```bash
curl https://yourdomain.com/api/hello
```

### Recommended Monitoring

1. **Application Performance**: Use APM tools like DataDog or New Relic
2. **Error Tracking**: Implement Sentry or similar
3. **Uptime Monitoring**: Use UptimeRobot or Pingdom
4. **Analytics**: Add Google Analytics or similar
5. **Logs**: Centralized logging with structured format

### Logging Setup

```typescript
// Example logging configuration
const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }));
  }
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun test
        
      - name: Type check
        run: bun run type-check
        
  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Build
        run: bun run build
        
      - name: Deploy
        run: |
          # Your deployment script here
          echo "Deploying to production..."
```

## 🧪 Testing Deployment

### Local Production Testing

```bash
# Build and test production locally
bun run build
bun start

# Test API endpoints
curl http://localhost:3000/api/hello
curl http://localhost:3000/api/hello/Production
```

### Staging Environment

1. Deploy to staging first
2. Run smoke tests
3. Verify all functionality
4. Check performance metrics
5. Deploy to production

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] Database migrations run (when applicable)
- [ ] Security review completed
- [ ] Performance testing done

### Post-deployment

- [ ] Health check endpoint responding
- [ ] Application loads correctly
- [ ] API endpoints functional
- [ ] Error tracking configured
- [ ] Monitoring alerts set up
- [ ] Backup procedures in place

## 🆘 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules bun.lock dist/
bun install
bun run build
```

#### Server Won't Start

```bash
# Check port availability
lsof -i :3000

# Use different port
PORT=3001 bun start
```

#### Memory Issues

```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun start
```

### Performance Issues

1. Check bundle size: Look at build output
2. Monitor memory usage: Use process monitors
3. Check database queries: Add query logging
4. Analyze network requests: Use browser DevTools

---

**Remember**: Always test deployments in a staging environment before production! 🏴‍☠️