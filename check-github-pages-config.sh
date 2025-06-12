#!/bin/bash

# GitHub Pages Configuration Checker
# This script helps identify GitHub Pages configuration issues

echo "🔍 GitHub Pages Configuration Checker"
echo "======================================"
echo ""

# Check repository type
REPO_URL=$(git config --get remote.origin.url)
REPO_NAME=$(basename "$REPO_URL" .git)
OWNER=$(echo "$REPO_URL" | sed -n 's/.*github\.com[:/]\([^/]*\)\/.*/\1/p')

echo "📋 Repository Information:"
echo "  Owner: $OWNER"
echo "  Repository: $REPO_NAME"
echo "  URL: $REPO_URL"

# Determine if this is a user/org site or project site
if [ "$REPO_NAME" = "$OWNER.github.io" ]; then
    SITE_TYPE="User/Organization"
    EXPECTED_URL="https://$OWNER.github.io"
    DEPLOYMENT_BRANCH="main"
else
    SITE_TYPE="Project"
    EXPECTED_URL="https://$OWNER.github.io/$REPO_NAME"
    DEPLOYMENT_BRANCH="gh-pages"
fi

echo "  Type: $SITE_TYPE GitHub Pages site"
echo "  Expected URL: $EXPECTED_URL"
echo "  Recommended deployment branch: $DEPLOYMENT_BRANCH"
echo ""

# Check current branch setup
echo "🌿 Branch Information:"
git branch -a | grep -E "(main|master|gh-pages)" | while read branch; do
    echo "  $branch"
done
echo ""

# Check last deployment to gh-pages
echo "📅 Last Deployment to gh-pages:"
if git rev-parse --verify origin/gh-pages >/dev/null 2>&1; then
    LAST_COMMIT=$(git log --pretty=format:"%h %ad %s" --date=relative origin/gh-pages -1)
    echo "  $LAST_COMMIT"
else
    echo "  No gh-pages branch found"
fi
echo ""

# Check GitHub Actions
echo "⚙️  GitHub Actions Configuration:"
if [ -f ".github/workflows/deploy.yml" ]; then
    echo "  ✅ GitHub Actions workflow found"
    echo "  File: .github/workflows/deploy.yml"
else
    echo "  ❌ No GitHub Actions workflow found"
fi
echo ""

# Check package.json homepage
echo "🏠 Package.json Configuration:"
if [ -f "package.json" ]; then
    HOMEPAGE=$(grep -o '"homepage": "[^"]*"' package.json | cut -d'"' -f4)
    if [ ! -z "$HOMEPAGE" ]; then
        echo "  Homepage: $HOMEPAGE"
        if [ "$HOMEPAGE" = "$EXPECTED_URL" ]; then
            echo "  ✅ Homepage matches expected URL"
        else
            echo "  ⚠️  Homepage doesn't match expected URL"
            echo "  Expected: $EXPECTED_URL"
        fi
    else
        echo "  ❌ No homepage field found"
    fi
else
    echo "  ❌ No package.json found"
fi
echo ""

# Check vite.config.ts base path
echo "⚡ Vite Configuration:"
if [ -f "vite.config.ts" ]; then
    BASE_PATH=$(grep -o "base: '[^']*'" vite.config.ts | cut -d"'" -f2)
    if [ ! -z "$BASE_PATH" ]; then
        echo "  Base path: $BASE_PATH"
        if [ "$SITE_TYPE" = "User/Organization" ] && [ "$BASE_PATH" = "/" ]; then
            echo "  ✅ Base path correct for user/org site"
        elif [ "$SITE_TYPE" = "Project" ] && [ "$BASE_PATH" = "/$REPO_NAME/" ]; then
            echo "  ✅ Base path correct for project site"
        else
            echo "  ⚠️  Base path might be incorrect"
            if [ "$SITE_TYPE" = "User/Organization" ]; then
                echo "  Recommended: base: '/'"
            else
                echo "  Recommended: base: '/$REPO_NAME/'"
            fi
        fi
    else
        echo "  ❌ No base path found in vite.config.ts"
    fi
else
    echo "  ❌ No vite.config.ts found"
fi
echo ""

echo "🎯 Recommendations:"
echo ""

if [ "$SITE_TYPE" = "User/Organization" ]; then
    echo "For User/Organization GitHub Pages sites ($OWNER.github.io):"
    echo "1. 🎯 Deploy to: main branch (source code) OR GitHub Actions"
    echo "2. 📂 Base path: / (root)"
    echo "3. 🌐 URL: https://$OWNER.github.io"
    echo ""
    echo "⚠️  IMPORTANT: User/org sites should NOT use gh-pages branch!"
    echo "   They should deploy directly from main branch or use GitHub Actions."
else
    echo "For Project GitHub Pages sites:"
    echo "1. 🎯 Deploy to: gh-pages branch"
    echo "2. 📂 Base path: /$REPO_NAME/"
    echo "3. 🌐 URL: https://$OWNER.github.io/$REPO_NAME"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Go to: https://github.com/$OWNER/$REPO_NAME/settings/pages"
if [ "$SITE_TYPE" = "User/Organization" ]; then
    echo "2. Set source to: 'GitHub Actions' (recommended) OR 'Deploy from a branch: main'"
else
    echo "2. Set source to: 'Deploy from a branch: gh-pages / / (root)'"
fi
echo "3. Wait 5-10 minutes for changes to take effect"
echo "4. Clear browser cache and visit: $EXPECTED_URL"
echo ""
echo "🔧 If issues persist:"
echo "• Check GitHub Actions tab for deployment errors"
echo "• Try hard refresh (Cmd+Shift+R) or incognito mode"
echo "• Verify all files are properly deployed to the target branch"
