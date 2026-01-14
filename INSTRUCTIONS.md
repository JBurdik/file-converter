# Self-Hosted Convex with Native Node.js Packages (sharp)

This guide explains how to use native Node.js packages like `sharp` in Convex actions when running self-hosted Convex.

## Problem

Convex actions with `"use node"` directive run in a Node.js environment, but the default Convex Docker image doesn't include native packages like `sharp`. You'll see errors like:

```
Could not load the "sharp" module using the linux-x64 runtime
```

## Solution

Create a custom Dockerfile that extends the Convex backend image with Node.js and your required packages.

## Setup

### 1. Create `Dockerfile.convex`

```dockerfile
FROM ghcr.io/get-convex/convex-backend:latest

USER root

# Install Node.js and libvips dependencies for sharp
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    python3 \
    libvips-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install packages in a separate directory (don't change WORKDIR - breaks startup)
RUN mkdir -p /convex_modules && \
    cd /convex_modules && \
    npm init -y && \
    npm install sharp

# Set NODE_PATH so actions can find the packages
ENV NODE_PATH=/convex_modules/node_modules
```

### 2. Update `docker-compose.yml`

Change the backend service from using an image to building from your Dockerfile:

```yaml
services:
  backend:
    # Replace this:
    # image: ghcr.io/get-convex/convex-backend:latest

    # With this:
    build:
      context: .
      dockerfile: Dockerfile.convex

    # ... rest of config stays the same
```

### 3. Build and Start

```bash
# Stop existing containers
docker compose down

# Rebuild with custom Dockerfile (use --no-cache if having issues)
docker compose build --no-cache

# Start containers
docker compose up -d
```

### 4. Deploy Convex Functions

```bash
npx convex dev --once
# or for continuous development:
npx convex dev
```

## Usage in Convex Actions

Your action file must have `"use node"` directive at the top:

```typescript
"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const processImage = internalAction({
  args: { imageId: v.id("_storage") },
  handler: async (ctx, { imageId }) => {
    // Dynamic import works because NODE_PATH points to our installed packages
    const sharp = (await import("sharp")).default;

    // Use sharp for image processing
    const buffer = await sharp(inputBuffer)
      .webp({ quality: 85 })
      .toBuffer();

    return buffer;
  },
});
```

## Adding More Packages

To add more native packages, update the Dockerfile:

```dockerfile
RUN mkdir -p /convex_modules && \
    cd /convex_modules && \
    npm init -y && \
    npm install sharp canvas pdfkit  # Add your packages here
```

Then rebuild:

```bash
docker compose down && docker compose build --no-cache && docker compose up -d
```

## How It Works

1. **Custom directory**: Packages are installed to `/convex_modules/node_modules` instead of the default location to avoid breaking Convex's internal files

2. **NODE_PATH**: This environment variable tells Node.js where to look for modules. When your action does `import("sharp")`, Node checks this path

3. **Native dependencies**: `libvips-dev` is the C library that `sharp` wraps. Other packages may need different system dependencies (check their docs)

## Troubleshooting

### "no such file or directory: ./run_backend.sh"
You changed `WORKDIR` in the Dockerfile. Don't use `WORKDIR` - use `cd` in RUN commands instead.

### "unable to find user convex"
Remove `USER convex` from the end of your Dockerfile. Running as root is fine for local development.

### Package still not found
1. Check NODE_PATH is set: `docker exec <container> env | grep NODE_PATH`
2. Verify package installed: `docker exec <container> ls /convex_modules/node_modules`
3. Rebuild without cache: `docker compose build --no-cache`

### Sharp-specific errors
Make sure `libvips-dev` is installed. For other image formats you may need additional libraries:
```dockerfile
RUN apt-get install -y libvips-dev libjpeg-dev libpng-dev libwebp-dev
```
