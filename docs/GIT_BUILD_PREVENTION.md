# Git Build Artifacts Prevention

## Problem

Git was picking up build files during build/deployment processes, causing:

- Unintended tracking of temporary files
- Repository bloat with build artifacts
- Conflicts during deployment
- Source maps and minified files being committed

## Solution

### 1. Enhanced .gitignore

Updated `.gitignore` with comprehensive patterns for:

- Build directories (`build/`, `dist/`, `hostinger-deploy/`)
- Source maps (`*.map`)
- Minified files (`*.min.js`, `*.min.css`)
- Bundle files (`*.bundle.js`, `*.bundle.css`)
- Cache directories (`.vite/`, `.cache/`, etc.)
- Build process temporary files
- Lock files created during builds

### 2. Build Process Scripts

#### Pre-build Script (`scripts/pre-build.sh`)

- Creates lock files to indicate build in progress
- Stashes uncommitted changes to prevent conflicts
- Cleans existing build directories
- Sets up clean build environment

#### Post-build Script (`scripts/post-build.sh`)

- Removes build lock files
- Restores any stashed changes
- Validates no build artifacts are tracked
- Shows final Git status

#### Cleanup Script (`scripts/clean-git-build-artifacts.sh`)

- Removes accidentally tracked build artifacts
- Cleans up temporary lock files
- Shows what was cleaned

### 3. Package.json Integration

Added npm script hooks:

- `prebuild`: Runs automatically before build
- `postbuild`: Runs automatically after build
- `clean:git`: Manual cleanup of Git artifacts

## Usage

### Automatic (Recommended)

Just run your normal build command:

```bash
npm run build
```

The pre/post scripts will run automatically.

### Manual Cleanup

If you notice build files in Git:

```bash
npm run clean:git
```

### Emergency Cleanup

If build artifacts were committed:

```bash
./scripts/clean-git-build-artifacts.sh
git commit -m "Remove build artifacts from tracking"
```

## Prevention Tips

1. **Always check Git status before committing:**

   ```bash
   git status
   ```

2. **Use .gitignore early** - Add patterns before first build

3. **Separate build and source directories** clearly

4. **Use CI/CD for builds** instead of local builds when possible

5. **Review .gitignore regularly** as build tools evolve

## Common Build Artifacts to Avoid

- `*.map` - Source maps
- `*.min.js` - Minified JavaScript
- `*.min.css` - Minified CSS
- `*.bundle.*` - Webpack/Vite bundles
- Build directories (`build/`, `dist/`, etc.)
- Cache directories (`.vite/`, `.cache/`, etc.)
- Temporary files (`*.tmp`, `*.temp`)
- Lock files from build processes

## Troubleshooting

### Build files still appearing in Git?

1. Check if files were already tracked: `git ls-files | grep build`

2. Run cleanup script: `npm run clean:git`
3. Verify .gitignore patterns: `git check-ignore path/to/file`

### Build process failing after changes?

1. Ensure scripts are executable: `chmod +x scripts/*.sh`
2. Check for shell compatibility (bash required)
3. Verify no critical files were accidentally ignored

### Stashed changes not restored?

1. Check for `.build-stash-flag` file
2. Manually restore: `git stash list` and `git stash pop`

## Monitoring

The post-build script automatically checks for tracked build artifacts and warns if any are found. Always review the output after builds.
