# Deploying to VPS

This guide explains how to deploy the file converter to a VPS with self-hosted Convex.

## Prerequisites

- VPS with Docker and Docker Compose installed
- Domain name (optional but recommended)
- Git installed

## VPS Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JBurdik/file-converter.git
cd file-converter
```

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```bash
# Set your VPS domain/IP
CONVEX_CLOUD_ORIGIN=https://convex.yourdomain.com
CONVEX_SITE_ORIGIN=https://convex-site.yourdomain.com
NEXT_PUBLIC_DEPLOYMENT_URL=https://convex.yourdomain.com
```

### 3. Start Convex Backend

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This starts:
- **Convex Backend** on port 3210 (with sharp support)
- **Convex Dashboard** on port 6791

### 4. Get Admin Key

1. Open Convex Dashboard: `http://your-vps-ip:6791`
2. Go to Settings → Admin Key
3. Copy the admin key to your `.env`:

```bash
CONVEX_ADMIN_KEY=your-admin-key-here
```

## Deploying Convex Functions

### Option 1: Deploy from Local Machine

```bash
npx convex deploy --url http://your-vps-ip:3210 --admin-key YOUR_ADMIN_KEY
```

### Option 2: Deploy using Docker

```bash
# Set environment variables
export CONVEX_SELF_HOST_URL=http://your-vps-ip:3210
export CONVEX_ADMIN_KEY=your-admin-key

# Run deploy container
docker compose -f docker-compose.deploy.yml up --build
```

### Option 3: SSH into VPS and Deploy

```bash
ssh user@your-vps

cd file-converter
git pull origin main

# Deploy functions
docker compose -f docker-compose.deploy.yml up --build
```

## Updating the Application

When you make changes to Convex functions:

```bash
# On VPS
cd file-converter
git pull origin main
docker compose -f docker-compose.deploy.yml up --build
```

Or from local machine:

```bash
npx convex deploy --url http://your-vps-ip:3210 --admin-key YOUR_ADMIN_KEY
```

## Reverse Proxy Setup (Nginx)

For production, use Nginx as reverse proxy with SSL:

```nginx
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
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    server_name convex-site.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3211;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Useful Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart services
docker compose -f docker-compose.prod.yml restart

# Stop services
docker compose -f docker-compose.prod.yml down

# Rebuild after Dockerfile changes
docker compose -f docker-compose.prod.yml up -d --build --force-recreate

# Check service health
docker compose -f docker-compose.prod.yml ps
```

## Troubleshooting

### Backend not starting
```bash
docker compose -f docker-compose.prod.yml logs backend
```

### Deploy fails with connection error
- Check if backend is running: `curl http://your-vps-ip:3210/version`
- Verify admin key is correct
- Check firewall allows port 3210

### Sharp not working
Ensure you're using the custom Dockerfile.convex which includes sharp dependencies.
