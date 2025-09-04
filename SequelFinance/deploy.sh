#!/bin/bash

# Finance U - Deployment Script
# This script helps deploy the application to various platforms

echo "🚀 Finance U Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Function to deploy to GitHub Pages
deploy_github_pages() {
    echo ""
    echo "📄 Deploying to GitHub Pages..."
    echo "1. Make sure your repository is public or you have GitHub Pro"
    echo "2. Go to your repository Settings > Pages"
    echo "3. Select 'main' branch as source"
    echo "4. Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
    echo ""
    echo "To enable automatic deployment:"
    echo "- Push this code to GitHub"
    echo "- The .github/workflows/deploy.yml will handle automatic deployment"
}

# Function to deploy to Netlify
deploy_netlify() {
    echo ""
    echo "🌐 Deploying to Netlify..."
    echo "1. Sign up at https://netlify.com"
    echo "2. Drag and drop the entire project folder to the Netlify dashboard"
    echo "3. Or connect your GitHub repository for automatic deployments"
    echo "4. Your site will get a URL like: https://amazing-site-name.netlify.app"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo ""
    echo "⚡ Deploying to Vercel..."
    echo "1. Sign up at https://vercel.com"
    echo "2. Install Vercel CLI: npm i -g vercel"
    echo "3. Run: vercel"
    echo "4. Follow the prompts to deploy"
}

# Function to deploy locally for testing
deploy_local() {
    echo ""
    echo "🏠 Starting local development server..."
    echo "Available options:"
    echo "1. Python: python3 -m http.server 8080"
    echo "2. Node.js: npm install -g http-server && http-server -p 8080"
    echo "3. PHP: php -S localhost:8080"
    echo ""
    echo "Then visit: http://localhost:8080"
}

# Main menu
while true; do
    echo ""
    echo "Choose deployment option:"
    echo "1. GitHub Pages (Free, automatic)"
    echo "2. Netlify (Free, recommended)"
    echo "3. Vercel (Free, fast)"
    echo "4. Local development server"
    echo "5. Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice

    case $choice in
        1)
            deploy_github_pages
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_vercel
            ;;
        4)
            deploy_local
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-5."
            ;;
    esac
done
