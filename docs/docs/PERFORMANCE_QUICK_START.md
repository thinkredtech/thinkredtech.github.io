# Performance Testing Quick Start Guide

## Installation

The performance testing system is already integrated into the ThinkRED monorepo. To get started:

```bash
# Install dependencies (if not already done)
npm install

# Verify installation
npm run perf:help
```

## Available Commands

### Quick Performance Check
For rapid development feedback:
```bash
npm run perf:test
```

### Comprehensive Performance Audit
Full analysis across all devices and pages:
```bash
npm run perf:comprehensive
```

### Pre-deployment Validation
Check if your build is ready for deployment:
```bash
npm run perf:validate
```

### Auto-fix Performance Issues
Automatically apply performance optimizations:
```bash
npm run perf:fix
```

## Test Scenarios

### Development Testing
Use `quick-check` for fast feedback during development:
- Tests: Desktop + Mobile
- Pages: Limited set (up to 5)
- Focus: Performance only
- Duration: ~2-3 minutes

### Production Validation
Use `comprehensive` for thorough production testing:
- Tests: Desktop + Mobile + Tablet
- Pages: Full site discovery (up to 50)
- Focus: All lighthouse categories
- Duration: ~10-15 minutes

### Pre-deployment Check
Use `pre-deployment` before releasing:
- Tests: Desktop + Mobile
- Pages: Key pages (up to 20)
- Focus: Performance + Accessibility + Best Practices
- Duration: ~5-8 minutes
- Blocks deployment on failure

## Understanding Reports

### Report Locations
- Individual results: `reports/performance/lighthouse/`
- Summary reports: `reports/performance/aggregated/`
- Trend analysis: `reports/performance/trends/`

### Key Metrics to Watch
1. **Performance Score**: Overall performance rating (aim for 85+)
2. **First Contentful Paint**: Time to first visible content (aim for <2s)
3. **Largest Contentful Paint**: Time to main content (aim for <4s)
4. **Cumulative Layout Shift**: Visual stability (aim for <0.1)
5. **Total Blocking Time**: Interactivity delay (aim for <300ms)

### Reading the HTML Reports
Open the generated HTML reports in your browser for:
- Visual performance timeline
- Detailed audit results
- Specific optimization recommendations
- Before/after comparisons (when using auto-fix)

## Configuration

### Performance Budgets
Adjust performance thresholds in `config/performance/default.json`:

```json
{
  "thresholds": {
    "performance": 85,
    "accessibility": 90,
    "bestPractices": 90,
    "seo": 90
  }
}
```

### Device Testing
Configure which devices to test:
- `desktop`: Standard desktop browser
- `mobile`: Mobile device simulation
- `tablet`: Tablet-sized screen
- `mobile-low`: Low-end mobile device

### Page Discovery
Control which pages are tested:
- Set `maxPages` to limit testing scope
- Use `discoveryMode: false` to test only specific URLs
- Configure `baseUrls` for different environments

## CI/CD Integration

### GitHub Actions
The system integrates with your existing CI/CD pipeline:

```yaml
# Add to your workflow
- name: Performance Testing
  run: npm run perf:validate
```

### Pre-commit Hooks
Block commits with performance regressions:

```json
{
  "husky": {
    "hooks": {
      "pre-push": "npm run perf:validate"
    }
  }
}
```

## Troubleshooting

### Common Issues

**Chrome/Chromium not found:**
```bash
# Install Chrome on macOS
brew install --cask google-chrome

# Or use Chromium
brew install --cask chromium
```

**Permission errors:**
```bash
# Fix report directory permissions
chmod -R 755 reports/
```

**Network timeouts:**
- Check internet connection
- Increase timeout in configuration
- Test with fewer pages initially

**Memory issues:**
- Close other applications
- Reduce concurrent testing
- Use `quick-check` scenario

### Debug Mode
Enable detailed logging:
```bash
DEBUG=lighthouse* npm run perf:test
```

## Best Practices

### During Development
- Use `npm run perf:test` for quick checks
- Focus on performance score and core web vitals
- Run tests on critical pages first

### Before Deployment
- Always run `npm run perf:validate`
- Review accessibility and SEO scores
- Use auto-fix for quick optimizations
- Check trend reports for regressions

### Performance Optimization
1. **Images**: Compress and use modern formats (WebP, AVIF)
2. **CSS**: Remove unused styles, minimize critical CSS
3. **JavaScript**: Code-split, lazy load non-critical resources
4. **Fonts**: Use font-display: swap, preload critical fonts
5. **Caching**: Configure proper cache headers

## Getting Help

### Documentation
- Full documentation: [Performance Testing Guide](operations/performance/testing.md)
- Configuration reference: `config/performance/default.json`
- API documentation: See individual script files

### Support
- Create an issue in the project repository
- Check the troubleshooting section
- Review lighthouse documentation: https://web.dev/lighthouse/

### Command Help
```bash
# Get detailed command options
node scripts/performance/performance-orchestrator.js --help

# List available scenarios
npm run perf:scenarios
```
