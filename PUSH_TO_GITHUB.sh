#!/bin/bash
echo "🚀 GitHub Push Helper Script"
echo "============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "✅ Git initialized"
fi

# Add all files
echo "Adding files to git..."
git add .
echo "✅ Files added"

# Commit
echo "Creating commit..."
git commit -m "Initial release: Form Automation System v1.0.0

- Automated form filling for 9 HR forms
- React frontend and Flask backend
- DOCX generation with perfect formatting
- Complete documentation and setup guides
- RESTful API and command-line tools"

echo "✅ Commit created"

echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Create repository on GitHub:"
echo "   - Go to https://github.com"
echo "   - Click 'New repository'"
echo "   - Name it: form-automation"
echo "   - Don't initialize with README"
echo "   - Click 'Create repository'"
echo ""
echo "2. Copy your repository URL (looks like):"
echo "   https://github.com/YOUR_USERNAME/form-automation.git"
echo ""
echo "3. Run this command (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/form-automation.git"
echo ""
echo "4. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "5. When prompted:"
echo "   - Username: Your GitHub username"
echo "   - Password: Your Personal Access Token"
echo ""
echo "💡 Need a Personal Access Token?"
echo "   GitHub → Settings → Developer settings → Personal access tokens"
echo "   Generate token with 'repo' permissions"
echo ""
echo "✅ Ready to push! Follow steps above."
