#!/bin/bash

# Hostinger Deployment Script for VIDIVICI

echo "🚀 Starting Hostinger deployment process..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Step 3: Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Step 4: Seed database (optional)
echo "🌱 Seeding database..."
npx prisma db seed

# Step 5: Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Deployment preparation complete!"
echo "📁 Upload the .next folder, prisma folder, and other files to your Hostinger hosting"