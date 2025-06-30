# Configuration Files Documentation

This document explains the purpose and usage of configuration files in the ThinkRED monorepo.

## 📁 Root Configuration Files

### `.gitignore`

**Purpose**: Specifies which files and directories Git should ignore
**Updated**: June 30, 2025
**Key Features**:

- ✅ Tracks `package-lock.json` for dependency consistency
- ✅ Completely ignores all build outputs (`build/`, `frontend/dist/`)
- ✅ Properly organizes reports: tracks incidents/operational/security, ignores automated
- ✅ Proper environment file exclusions
- ✅ Security-sensitive files excluded
- ✅ Clean report organization with appropriate directory structure

### `.prettierrc.json`

**Purpose**: Code formatting configuration for Prettier
**Settings**:

- Print width: 120 characters (standard code), 100 (markdown)
- Tab width: 2 spaces
- Single quotes, trailing commas (ES5)
- LF line endings for cross-platform compatibility

### `.prettierignore`

**Purpose**: Files and directories Prettier should not format
**Updated**: June 30, 2025
**Excludes**:

- Build outputs and generated files
- Asset files (images, fonts)
- Package lock files
- Environment files
- Generated reports

### `.markdownlint.json`

**Purpose**: Markdown linting rules configuration
**Settings**:

- Line length: 150 characters (accommodates technical documentation)
- Disabled strict heading rules for flexibility
- Enabled whitespace and blank line rules

## 📁 Backend Configuration

### `backend/.gitignore`

**Purpose**: Backend-specific ignore patterns
**Key Exclusions**:

- `.env` files (contain sensitive Google Apps Script credentials)
- `.clasprc.json` (CLASP authentication)
- Node modules and logs

### `backend/.clasp.json`

**Purpose**: Google Apps Script deployment configuration
**Contains**:

- Script ID for Google Apps Script project
- File extension mappings
- **Status**: ✅ Active and properly configured

## 📁 Config Directory

### `config/.gitleaks.toml`

**Purpose**: Security scanning configuration for GitLeaks
**Features**:

- Allows documented placeholder patterns
- Prevents false positives from examples
- Maintains security while allowing documentation

### `config/.deployment-config.json`

**Purpose**: Deployment environment configuration
**Environments**:

- Production (GitHub Pages)
- Hostinger (backup deployment)
- Staging and Development
  **Status**: ✅ Active template

### `config/.env.example`

**Purpose**: Environment variable template
**Usage**: Copy to `.env.local` for local development

### `config/.prettierignore`

**Purpose**: Additional Prettier ignore patterns for config files
**Status**: ✅ Active

## 📁 Directory Structure Preservation

### `reports/automated/.gitkeep`

**Purpose**: Preserve automated reports directory structure
**Usage**: Ensures directory exists for CI/CD processes

### `reports/templates/.gitkeep`

**Purpose**: Preserve report templates directory
**Usage**: Maintains directory for report generation templates

## 🔧 Configuration Management Best Practices

### ✅ Active Configurations

- All configuration files are actively used
- No duplicate or conflicting configurations
- Environment-specific settings properly isolated

### 🧹 Cleanup Completed

- Removed duplicate `.prettierrc.json` and `.markdownlint.json` from config/
- Updated `.gitignore` for better precision
- Added necessary `.gitkeep` files
- Improved `.prettierignore` accuracy

### 🔒 Security Considerations

- Environment files properly excluded
- Sensitive credentials not tracked
- GitLeaks configuration prevents security issues
- Documentation examples safely allowed

---

**Last Updated**: June 30, 2025
**Next Review**: July 30, 2025
