#!/bin/bash
# PingBall Deployment Script
# Usage: ./deploy.sh

set -e

echo "=== PingBall Deployment ==="

# 1. Check .env
if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and fill in your values."
  exit 1
fi

# 2. Install deps
echo "[1/4] Installing dependencies..."
pnpm install --frozen-lockfile

# 3. Run database setup (RLS, policies, default tournament)
echo "[2/4] Running database setup..."
source .env 2>/dev/null || true
DATABASE_URL=${DATABASE_URL} npx tsx drizzle/setup.ts

# 4. Build
echo "[3/4] Building production bundle..."
pnpm build

# 5. Done
echo "[4/4] Build complete!"
echo ""
echo "Deploy the contents of ./dist to any static host:"
echo "  - Vercel:    vercel --prod"
echo "  - Netlify:   ntl deploy --prod --dir=dist"
echo "  - Cloudflare Pages: wrangler pages deploy dist"
echo "  - Any static server:  npx serve dist"
