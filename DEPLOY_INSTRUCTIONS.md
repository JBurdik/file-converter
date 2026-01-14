# Deploying to VPS

This guide explains how to deploy the file converter to a VPS with self-hosted Convex.

## Prerequisites

- VPS with Docker and Docker Compose installed
- Domain name (optional but recommended)
- Git installed

## Quick Start

```bash
# Clone repo
git clone https://github.com/JBurdik/file-converter.git
cd file-converter

# Setup environment
cp .env.example .env

# Start backend first to get admin key
docker compose -f docker-compose.prod.yml up -d backend dashboard

# Get admin key from dashboard (http://your-ip:6791)
# Add it to .env: CONVEX_ADMIN_KEY=your-key

# Start all services (deploy runs automatically once, then exits)
docker compose -f docker-compose.prod.yml up -d --build
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | Frontend application |
| backend | 3210 | Convex backend API |
| site | 3211 | Convex HTTP actions |
| dashboard | 6791 | Convex admin dashboard |
| deploy | - | Deploys Convex functions (runs once, then exits) |

## Detailed Setup

### 1. Clone and Configure

```bash
git clone https://github.com/JBurdik/file-converter.git
cd file-converter
cp .env.example .env
```

Edit `.env` with your production values:

```bash
# Your VPS domain/IP
CONVEX_CLOUD_ORIGIN=https://convex.yourdomain.com
CONVEX_SITE_ORIGIN=https://convex-site.yourdomain.com
NEXT_PUBLIC_DEPLOYMENT_URL=https://convex.yourdomain.com

# Ports (change if needed)
APP_PORT=3000
CONVEX_PORT=3210
DASHBOARD_PORT=6791
```

### 2. Start Services

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 3. Get Admin Key

1. Open Convex Dashboard: `http://your-vps-ip:6791`
2. Go to Settings → Admin Key
3. Add to `.env`:

```bash
CONVEX_ADMIN_KEY=your-admin-key-here
```

### 4. Start All Services

```bash
# Deploy service runs automatically once backend is healthy
docker compose -f docker-compose.prod.yml up -d --build
```

## Updating

When you make changes:

```bash
# Pull latest code
git pull origin main

# Rebuild and restart (deploy runs automatically)
docker compose -f docker-compose.prod.yml up -d --build

# Or restart only specific services
docker compose -f docker-compose.prod.yml up -d --build app
docker compose -f docker-compose.prod.yml up -d --build deploy  # redeploy functions
```

## Reverse Proxy (Nginx)

For production with SSL:

```nginx
# Frontend app
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Convex backend
server {
    listen 443 ssl;
    server_name convex.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3210;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Commands Reference

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# Stop all services
docker compose -f docker-compose.prod.yml down

# View logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f app

# Rebuild specific service
docker compose -f docker-compose.prod.yml up -d --build app

# Redeploy Convex functions manually
docker compose -f docker-compose.prod.yml up -d --build deploy

# Check service status
docker compose -f docker-compose.prod.yml ps
```

## Troubleshooting

### App not starting
```bash
docker compose -f docker-compose.prod.yml logs app
```

### Convex deploy fails
- Verify backend is healthy: `curl http://localhost:3210/version`
- Check admin key in `.env`
- Ensure backend is running before deploy

### Sharp not working
The custom `Dockerfile.convex` includes sharp support. If issues persist:
```bash
docker compose -f docker-compose.prod.yml up -d --build --force-recreate backend
```
