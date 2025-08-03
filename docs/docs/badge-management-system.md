# Badge Management System

## Overview

This document explains how the status badges in the README.md file are managed to prevent
duplication and conflicts.

## Current Badge Structure

The README.md file contains two sets of badges in the header:

### Repository Health Badges (Static)

- Repository Health
- Performance
- Dependencies
- Documentation

### Build Status Badges (Dynamic)

- Build Status
- Code Quality
- Security

## Badge Update Workflow

### Primary Badge Manager

- **File**: `.github/workflows/quality-security-checks.yml`
- **Job**: `update-badges`
- **Responsibility**: Updates the three dynamic badges (Build, Code Quality, Security)
- **Trigger**: After all quality checks complete on main branch

### Disabled Workflows

The following workflows previously modified README.md but have been disabled to prevent conflicts:

- `repository-health-monitor.yml` - Now only updates reports/
- `realtime-status-dashboard.yml` - Now only updates reports/status-dashboard.md

## Badge Update Logic

1. **Conditional Updates**: Only updates badges if their status has changed
2. **Precise Targeting**: Uses sed to target specific badge lines by pattern
3. **Backup & Recovery**: Creates backup files during updates
4. **Conflict Prevention**: Only one workflow modifies README.md

## Troubleshooting

### If Badges Get Duplicated Again

1. Check if multiple workflows are trying to modify README.md:

   ```bash
   grep -r "README.md" .github/workflows/
   ```

2. Verify the badge section structure in README.md:

   ```bash
   head -20 README.md | grep -A 10 "Badge"
   ```

3. Check recent commits for badge-related changes:
   ```bash
   git log --oneline -10 --grep="badge"
   ```

### Manual Badge Restoration

If badges get corrupted, manually restore this section in README.md:

```markdown
[![Repository Health](https://img.shields.io/badge/Repository%20Health-100%25-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Performance](https://img.shields.io/badge/Performance-100%25-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Dependencies](https://img.shields.io/badge/Dependencies-healthy-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Documentation](https://img.shields.io/badge/Documentation-100%25-brightgreen)](./docs/)

[![Build Status](https://img.shields.io/badge/Build-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
[![Security](https://img.shields.io/badge/Security-passed-brightgreen)](https://github.com/thinkredtech/thinkredtech.github.io/actions)
```

## Best Practices

1. **Single Source of Truth**: Only one workflow should modify README.md badges
2. **Conditional Updates**: Only update when status actually changes
3. **Precise Patterns**: Use specific patterns to avoid unintended replacements
4. **Testing**: Test badge updates on feature branches before merging
5. **Monitoring**: Check README.md after workflow runs to ensure correctness

## Implementation Details

### Badge Update Command

```bash
sed -i.bak -E "
  /^\[\!\[Build Status\]/ {
    s|.*|$BUILD_BADGE|
    n
    s|.*|$QUALITY_BADGE|
    n
    s|.*|$SECURITY_BADGE|
  }
" README.md
```

### Change Detection

```bash
if ! grep -q "Build-${build_status}" README.md || ! grep -q "Code%20Quality-${lint_status}" README.md || ! grep -q "Security-${security_status}" README.md; then
  # Update badges
fi
```

## Maintenance

- Review this system quarterly
- Monitor for badge duplication issues
- Update patterns if README.md structure changes
- Document any modifications to this system
