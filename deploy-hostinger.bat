@echo off
setlocal enabledelayedexpansion

rem ThinkRed Website - Hostinger Deployment Script (Windows)
rem This script builds the React app and prepares it for Hostinger hosting

echo [96m🚀 Starting Hostinger Deployment Process...[0m

rem Configuration
set BUILD_DIR=build
set DEPLOY_DIR=hostinger-deploy
set ZIP_FILE=thinkred-website.zip

rem Step 1: Clean previous builds
echo [93m🧹 Cleaning previous builds...[0m
if exist "%BUILD_DIR%" (
    rmdir /s /q "%BUILD_DIR%"
    echo [92m✅ Cleaned build directory[0m
)

if exist "%DEPLOY_DIR%" (
    rmdir /s /q "%DEPLOY_DIR%"
    echo [92m✅ Cleaned deploy directory[0m
)

if exist "%ZIP_FILE%" (
    del "%ZIP_FILE%"
    echo [92m✅ Removed old zip file[0m
)

rem Step 2: Install dependencies
echo [93m📦 Installing dependencies...[0m
call npm install
if errorlevel 1 (
    echo [91m❌ Failed to install dependencies[0m
    exit /b 1
)

rem Step 3: Run type checking
echo [93m🔍 Running type checking...[0m
call npm run type-check
if errorlevel 1 (
    echo [91m❌ Type checking failed[0m
    exit /b 1
)

rem Step 4: Run linting
echo [93m🔧 Running linting...[0m
call npm run lint
if errorlevel 1 (
    echo [91m❌ Linting failed[0m
    exit /b 1
)

rem Step 5: Build the project
echo [93m🏗️  Building the project...[0m
call npm run build
if errorlevel 1 (
    echo [91m❌ Build failed[0m
    exit /b 1
)

rem Step 6: Verify build was successful
if not exist "%BUILD_DIR%" (
    echo [91m❌ Build failed - build directory not found[0m
    exit /b 1
)

echo [92m✅ Build completed successfully[0m

rem Step 7: Create deployment directory
echo [93m📁 Preparing deployment files...[0m
mkdir "%DEPLOY_DIR%"

rem Step 8: Copy build files to deployment directory
xcopy "%BUILD_DIR%\*" "%DEPLOY_DIR%\" /s /e /y

rem Step 9: Create .htaccess for React Router (SPA)
echo [93m⚙️  Creating .htaccess for React Router...[0m
(
echo Options -MultiViews
echo RewriteEngine On
echo RewriteCond %%{REQUEST_FILENAME} !-f
echo RewriteRule ^ index.html [QSA,L]
echo.
echo # Enable compression
echo ^<IfModule mod_deflate.c^>
echo     AddOutputFilterByType DEFLATE text/plain
echo     AddOutputFilterByType DEFLATE text/html
echo     AddOutputFilterByType DEFLATE text/xml
echo     AddOutputFilterByType DEFLATE text/css
echo     AddOutputFilterByType DEFLATE application/xml
echo     AddOutputFilterByType DEFLATE application/xhtml+xml
echo     AddOutputFilterByType DEFLATE application/rss+xml
echo     AddOutputFilterByType DEFLATE application/javascript
echo     AddOutputFilterByType DEFLATE application/x-javascript
echo ^</IfModule^>
echo.
echo # Cache static assets
echo ^<IfModule mod_expires.c^>
echo     ExpiresActive on
echo     ExpiresByType text/css "access plus 1 year"
echo     ExpiresByType application/javascript "access plus 1 year"
echo     ExpiresByType image/png "access plus 1 year"
echo     ExpiresByType image/jpg "access plus 1 year"
echo     ExpiresByType image/jpeg "access plus 1 year"
echo     ExpiresByType image/gif "access plus 1 year"
echo     ExpiresByType image/svg+xml "access plus 1 year"
echo     ExpiresByType image/webp "access plus 1 year"
echo     ExpiresByType application/pdf "access plus 1 month"
echo     ExpiresByType text/html "access plus 1 day"
echo ^</IfModule^>
echo.
echo # Security headers
echo ^<IfModule mod_headers.c^>
echo     Header always set X-Content-Type-Options nosniff
echo     Header always set X-Frame-Options DENY
echo     Header always set X-XSS-Protection "1; mode=block"
echo     Header always set Referrer-Policy "strict-origin-when-cross-origin"
echo ^</IfModule^>
) > "%DEPLOY_DIR%\.htaccess"

rem Step 10: Create a robots.txt if it doesn't exist
if not exist "%DEPLOY_DIR%\robots.txt" (
    echo [93m🤖 Creating robots.txt...[0m
    (
    echo User-agent: *
    echo Allow: /
    echo.
    echo Sitemap: https://thinkred.tech/sitemap.xml
    ) > "%DEPLOY_DIR%\robots.txt"
)

rem Step 11: Create deployment info file
echo [93m📝 Creating deployment info...[0m
(
echo ThinkRed Website Deployment
echo ===========================
echo Build Date: %date% %time%
echo Node Version: 
call node --version
echo NPM Version: 
call npm --version
echo.
echo Deployment Instructions:
echo 1. Upload all files from this directory to your Hostinger public_html folder
echo 2. Ensure .htaccess file is uploaded ^(it may be hidden^)
echo 3. Your website should be live at your domain
echo.
echo Note: This is a Single Page Application ^(SPA^) built with React and Vite.
echo The .htaccess file ensures proper routing for React Router.
) > "%DEPLOY_DIR%\deployment-info.txt"

rem Step 12: Create zip file (using PowerShell)
echo [93m📦 Creating zip file for upload...[0m
powershell -command "Compress-Archive -Path '%DEPLOY_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force"

rem Step 13: Display completion message
echo [92m🎉 Deployment preparation complete![0m
echo [96m📁 Files ready in: [93m%DEPLOY_DIR%[0m
echo [96m📦 Zip file created: [93m%ZIP_FILE%[0m
echo.
echo [93m📋 Next Steps:[0m
echo 1. Extract or upload the contents of '[93m%DEPLOY_DIR%[0m' to your Hostinger public_html folder
echo 2. Or upload and extract '[93m%ZIP_FILE%[0m' directly to your Hostinger file manager
echo 3. Ensure the [93m.htaccess[0m file is uploaded ^(it may be hidden in file managers^)
echo 4. Your website should be live at your domain!
echo.
echo [92m✅ All files are ready for Hostinger deployment![0m

pause
