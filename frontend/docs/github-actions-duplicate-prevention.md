# GitHub Actions Duplicate Issue Prevention

## Overview

This document explains the duplicate issue prevention system implemented across all GitHub Actions
workflows that create issues.

## Problem Solved

Previously, GitHub Actions workflows could create duplicate issues when:

- Multiple workflow runs triggered the same issue type
- Issues were closed and reopened by subsequent runs
- Different workflows detected the same underlying problem

## Solution Implementation

### Enhanced Duplicate Prevention Logic

All issue-creating workflows now implement a comprehensive duplicate prevention system:

1. **Time-based Check**: Checks both open and recently closed issues (last 7 days)
2. **Label-based Filtering**: Uses specific labels to identify relevant issues
3. **Title Pattern Matching**: Matches specific title patterns for precise identification
4. **State Awareness**: Considers both open and recently closed issues

### Modified Workflows

#### 1. Quality Security Checks (`quality-security-checks.yml`)

- **Issue Type**: Security Vulnerabilities
- **Labels**: `['security', 'vulnerability']`
- **Title Pattern**: "Security Vulnerabilities Detected"
- **Prevention**: Checks open + 7-day closed issues

#### 2. Sensitive Data Monitor (`sensitive-data-monitor.yml`)

- **Issue Types**:
  - Sensitive Data Exposure (`['security', 'sensitive-data']`)
  - CSP Violations (`['security', 'csp']`)
- **Title Patterns**:
  - "Sensitive Data Exposure"
  - "Content Security Policy Violations"
- **Prevention**: Checks open + 7-day closed issues for each type

#### 3. Realtime Status Dashboard (`realtime-status-dashboard.yml`)

- **Issue Type**: Service Incidents
- **Labels**: `['incident', 'monitoring']`
- **Title Patterns**: "Service Incident" or "Service Degradation"
- **Prevention**: Checks open + 7-day closed issues

## Code Implementation

### Example Implementation Pattern

```javascript
// Enhanced duplicate prevention logic:
// - Checks both open and recently closed issues (last 7 days)
// - Prevents spam from repeated workflow runs
// - Uses specific labels and title patterns for precise matching

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const existingOpenIssues = await github.rest.issues.listForRepo({
  owner: context.repo.owner,
  repo: context.repo.repo,
  labels: ['security', 'vulnerability'],
  state: 'open',
});

const existingClosedIssues = await github.rest.issues.listForRepo({
  owner: context.repo.owner,
  repo: context.repo.repo,
  labels: ['security', 'vulnerability'],
  state: 'closed',
  since: sevenDaysAgo.toISOString(),
});

const allRelevantIssues = [...existingOpenIssues.data, ...existingClosedIssues.data];

const issueExists = allRelevantIssues.some(issue =>
  issue.title.includes('Security Vulnerabilities Detected')
);

if (!issueExists) {
  // Create new issue
} else {
  console.log('Issue already exists or was recently closed, skipping creation');
}
```

## Benefits

1. **Reduced Noise**: Eliminates duplicate issues in the repository
2. **Better Organization**: Makes it easier to track and manage security issues
3. **Improved Efficiency**: Prevents teams from working on duplicate reports
4. **Rate Limiting**: Respects GitHub API rate limits by reducing unnecessary calls
5. **Historical Awareness**: Prevents reopening recently resolved issues

## Configuration

### Adjustable Parameters

- **Time Window**: Currently set to 7 days, can be adjusted in each workflow
- **Label Filters**: Customizable per issue type
- **Title Patterns**: Can be modified for different matching strategies

### Future Enhancements

1. **Content Similarity**: Could add body content comparison for more precise matching
2. **Custom Time Windows**: Different time windows for different issue types
3. **Priority-based Logic**: Different behavior for critical vs. normal issues
4. **Integration**: Could integrate with external issue tracking systems

## Monitoring

Each workflow logs its duplicate prevention decisions:

- `"Created new [issue-type] issue"` - New issue created
- `"[Issue-type] issue already exists or was recently closed, skipping creation"` - Duplicate
  prevented

## Testing

To test the duplicate prevention:

1. Trigger a workflow that would create an issue
2. Verify the issue is created
3. Trigger the same workflow again immediately
4. Verify no duplicate issue is created
5. Close the issue and trigger again within 7 days
6. Verify no new issue is created

## Maintenance

Review and update the duplicate prevention logic when:

- Adding new issue types
- Changing issue title formats
- Modifying label strategies
- Adjusting time windows for different scenarios
