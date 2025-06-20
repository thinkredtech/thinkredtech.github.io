# Content Security Policy Configuration for ThinkRED Website

## Current CSP Implementation

### Main Application (index.html)

```
default-src 'self';
script-src 'self' 'sha256-0NxahHEO72D7Vp5bmpNZ3riin6FSjQfgKZkgCgidJTU=';
style-src 'self' 'sha256-H+6lPbV/vJ1lgdTSmWm5fAdI9vCdMj4gwcNXnv3aG5c=' 'sha256-Mm20OO1+ZoAQCjSvkcKqOuvtkRZzg0T57AD4heZuuro=' 'sha256-FPq4rxlAev/A46XHPFsgqwW+uVWhvOA/L8khCxIXKV8=' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
block-all-mixed-content;
```

### Public Build (public/index.html)

```
default-src 'self';
script-src 'self' 'sha256-8VdxYuZCf1QcZCQfOAOOdY63KRbiqT8hp/La9TzrNlg=';
style-src 'self' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.thinkred.tech;
object-src 'none';
media-src 'self';
child-src 'none';
frame-src 'none';
worker-src 'self';
manifest-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
block-all-mixed-content;
```

### 404 Page (public/404.html)

```
default-src 'self';
script-src 'self' 'sha256-G5TvyTuo3I5v0tY9LYf2WMhdsedxTYQ70Np/hyIMYgs=';
style-src 'self';
img-src 'self' data: https:;
connect-src 'self';
object-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

## Script Hashes Explained

### SHA256 Hashes for Inline Scripts

1. **0NxahHEO72D7Vp5bmpNZ3riin6FSjQfgKZkgCgidJTU=** (index.html)
   - GitHub Pages SPA routing script (formatted for development)

2. **8VdxYuZCf1QcZCQfOAOOdY63KRbiqT8hp/La9TzrNlg=** (public/index.html)
   - GitHub Pages SPA routing script (formatted for production)

3. **G5TvyTuo3I5v0tY9LYf2WMhdsedxTYQ70Np/hyIMYgs=** (public/404.html)
   - GitHub Pages 404 redirect script

### SHA256 Hashes for Inline Styles

1. **H+6lPbV/vJ1lgdTSmWm5fAdI9vCdMj4gwcNXnv3aG5c=** (index.html)
   - Main noscript container styling

2. **Mm20OO1+ZoAQCjSvkcKqOuvtkRZzg0T57AD4heZuuro=** (index.html)
   - H1 margin styling in noscript

3. **FPq4rxlAev/A46XHPFsgqwW+uVWhvOA/L8khCxIXKV8=** (index.html)
   - Paragraph styling in noscript

## Security Benefits

### Eliminated 'unsafe-inline' Directives

- ✅ No more `script-src 'unsafe-inline'`
- ✅ No more `style-src 'unsafe-inline'`
- ✅ Only explicitly allowed inline content via hashes

### Enhanced Protection

- 🛡️ Prevents XSS attacks from injected scripts
- 🛡️ Blocks unauthorized inline styles
- 🛡️ Maintains functionality for legitimate inline content
- 🛡️ Restricts content sources to trusted origins

## Maintenance Guidelines

### When to Update Hashes

1. **Script Changes**: If any inline script content changes, recalculate the hash
2. **Style Changes**: If any inline style content changes, recalculate the hash
3. **New Inline Content**: Generate new hash for any new inline scripts/styles

### Hash Calculation Commands

```bash
# For scripts
echo "script content here" | openssl dgst -sha256 -binary | openssl base64

# For styles
echo "style content here" | openssl dgst -sha256 -binary | openssl base64
```

### Testing CSP

1. Open browser developer tools
2. Navigate to the website
3. Check Console for CSP violations
4. Verify no blocked resources
5. Test all functionality works correctly

## Compliance Status

- ✅ **OWASP CSP Guidelines**: Compliant
- ✅ **Mozilla CSP Best Practices**: Compliant
- ✅ **No unsafe-inline**: Eliminated security risks
- ✅ **Minimal External Sources**: Only trusted CDNs
- ✅ **Strict Directives**: Maximum security
