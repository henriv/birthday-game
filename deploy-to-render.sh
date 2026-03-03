#!/bin/bash

# Birthday Grammar Game - Open Render Dashboard with Instructions
# This opens Render and shows you exactly what to configure

echo ""
echo "🎉 Birthday Grammar Game - Deploy to Render"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE_NAME="birthday-grammar-game"
GITHUB_REPO="https://github.com/henriv/birthday-game"

echo -e "${GREEN}✓ Your code is on GitHub!${NC}"
echo ""
echo -e "${YELLOW}Opening Render Dashboard...${NC}"
echo ""

# Open Render dashboard in browser
open "https://dashboard.render.com" 2>/dev/null || xdg-open "https://dashboard.render.com" 2>/dev/null || start "https://dashboard.render.com" 2>/dev/null

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📋 RENDER CONFIGURATION${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Follow these steps:${NC}"
echo ""
echo "1️⃣  Click 'New +' in top right"
echo "2️⃣  Click 'Web Service'"
echo "3️⃣  Click 'Connect' next to '$GITHUB_REPO'"
echo "4️⃣  Click 'Connect' to authorize GitHub"
echo ""
echo -e "${BLUE}Configure with these EXACT values:${NC}"
echo ""
echo -e "   ${YELLOW}Name:${NC}           $SERVICE_NAME"
echo -e "   ${YELLOW}Runtime:${NC}        Node"
echo -e "   ${YELLOW}Region:${NC}         oregon (or default)"
echo -e "   ${YELLOW}Branch:${NC}         main"
echo -e "   ${YELLOW}Build Command:${NC}  npm install && npm run build"
echo -e "   ${YELLOW}Start Command:${NC}  npm run start"
echo ""
echo "5️⃣  Leave Environment Variables EMPTY (none needed)"
echo "6️⃣  Click 'Create Web Service'"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}⏱️  Wait 2-3 minutes for deployment${NC}"
echo ""
echo "Your game will be live at:"
echo -e "${GREEN}https://$SERVICE_NAME-xxxx.onrender.com${NC}"
echo ""
echo -e "${YELLOW}⚠️  After deployment, revoke your tokens:${NC}"
echo "   • GitHub: https://github.com/settings/tokens"
echo "   • Render: https://dashboard.render.com/account/api-tokens"
echo ""
echo -e "${GREEN}🎉 Good luck with your birthday game!${NC}"
echo ""
