#!/bin/bash

# Birthday Grammar Game - Automated Deployment Script
# This script pushes your code to GitHub and sets up Render deployment

set -e  # Exit on any error

echo "🎉 Birthday Grammar Game - Automated Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found!${NC}"
    echo "Please run this script from the birthday-game directory"
    exit 1
fi

echo -e "${YELLOW}Step 1: Configuring Git...${NC}"
git config user.email "birthday-game@deploy.local"
git config user.name "Birthday Game Deploy"
echo -e "${GREEN}✓ Git configured${NC}"
echo ""

echo -e "${YELLOW}Step 2: Staging and committing files...${NC}"
git add .
git commit -m "Birthday Grammar Game - Ready to deploy" || echo "Already committed"
echo -e "${GREEN}✓ Files committed${NC}"
echo ""

echo -e "${YELLOW}Step 3: Setting up GitHub remote...${NC}"
# Remove existing remote if it exists
git remote remove origin 2>/dev/null || true

# Add the remote with authentication token
GITHUB_TOKEN="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"
GITHUB_REPO="https://henriv:${GITHUB_TOKEN}@github.com/henriv/lry.git"

git remote add origin "$GITHUB_REPO"
echo -e "${GREEN}✓ GitHub remote configured${NC}"
echo ""

echo -e "${YELLOW}Step 4: Renaming branch to main...${NC}"
git branch -M main
echo -e "${GREEN}✓ Branch renamed to main${NC}"
echo ""

echo -e "${YELLOW}Step 5: Pushing to GitHub...${NC}"
echo "(This may take a minute...)"
git push -u origin main

echo -e "${GREEN}✓ Code pushed to GitHub!${NC}"
echo ""

echo "=================================================="
echo -e "${GREEN}✅ GitHub deployment complete!${NC}"
echo "=================================================="
echo ""

echo -e "${YELLOW}Next Step: Deploy to Render${NC}"
echo ""
echo "1. Go to: https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repo (lry)"
echo "4. Set these values:"
echo "   - Name: birthday-grammar-game"
echo "   - Runtime: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm run start"
echo "5. Click 'Create Web Service'"
echo ""
echo "Your app will be live in 2-3 minutes!"
echo ""
echo "⚠️  After deployment completes:"
echo "   1. Revoke GitHub token: https://github.com/settings/tokens"
echo "   2. Revoke Render token: https://dashboard.render.com/account/api-tokens"
echo ""
echo -e "${GREEN}🎉 You're all set! Your game will be live soon!${NC}"
