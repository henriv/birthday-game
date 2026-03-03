@echo off
REM Birthday Grammar Game - Automated Deployment Script (Windows)
REM This script pushes your code to GitHub and sets up Render deployment

setlocal enabledelayedexpansion

echo.
echo 🎉 Birthday Grammar Game - Automated Deployment
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo ❌ Error: package.json not found!
    echo Please run this script from the birthday-game directory
    pause
    exit /b 1
)

echo Step 1: Configuring Git...
git config user.email "birthday-game@deploy.local"
git config user.name "Birthday Game Deploy"
echo ✓ Git configured
echo.

echo Step 2: Staging and committing files...
git add .
git commit -m "Birthday Grammar Game - Ready to deploy" || echo Files already committed
echo ✓ Files committed
echo.

echo Step 3: Setting up GitHub remote...
REM Remove existing remote if it exists
git remote remove origin 2>nul

REM Add the remote with authentication token
set GITHUB_TOKEN=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
set GITHUB_REPO=https://henriv:!GITHUB_TOKEN!@github.com/henriv/lry.git

git remote add origin %GITHUB_REPO%
echo ✓ GitHub remote configured
echo.

echo Step 4: Renaming branch to main...
git branch -M main
echo ✓ Branch renamed to main
echo.

echo Step 5: Pushing to GitHub...
echo (This may take a minute...)
git push -u origin main

echo.
echo ==================================================
echo ✅ GitHub deployment complete!
echo ==================================================
echo.

echo Next Step: Deploy to Render
echo.
echo 1. Go to: https://dashboard.render.com
echo 2. Click 'New +' ^> 'Web Service'
echo 3. Connect your GitHub repo (lry)
echo 4. Set these values:
echo    - Name: birthday-grammar-game
echo    - Runtime: Node
echo    - Build Command: npm install ^&^& npm run build
echo    - Start Command: npm run start
echo 5. Click 'Create Web Service'
echo.
echo Your app will be live in 2-3 minutes!
echo.
echo ⚠️  After deployment completes:
echo    1. Revoke GitHub token: https://github.com/settings/tokens
echo    2. Revoke Render token: https://dashboard.render.com/account/api-tokens
echo.
echo 🎉 You're all set! Your game will be live soon!
echo.

pause
