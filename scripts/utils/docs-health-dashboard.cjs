#!/usr/bin/env node

/**
 * Documentation Health Dashboard Generator
 * Creates a comprehensive health dashboard for documentation system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../..');
const DOCS_DIR = path.join(REPO_ROOT, 'docs');
const REPORTS_DIR = path.join(REPO_ROOT, 'reports', 'documentation');
const FRONTEND_DIR = path.join(REPO_ROOT, 'frontend');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function getDocumentationStats() {
    log('📊 Gathering documentation statistics...', 'blue');
    
    const stats = {
        totalFiles: 0,
        totalSize: 0,
        filesByType: {},
        largestFiles: [],
        lastModified: null,
        directories: new Set()
    };

    function processFile(filePath) {
        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath);
        const relativePath = path.relative(REPO_ROOT, filePath);
        
        stats.totalFiles++;
        stats.totalSize += stat.size;
        stats.filesByType[ext] = (stats.filesByType[ext] || 0) + 1;
        stats.directories.add(path.dirname(relativePath));
        
        stats.largestFiles.push({
            path: relativePath,
            size: stat.size,
            modified: stat.mtime
        });
        
        if (!stats.lastModified || stat.mtime > stats.lastModified) {
            stats.lastModified = stat.mtime;
        }
    }

    // Process all documentation files
    function scanDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                scanDirectory(fullPath);
            } else if (stat.isFile() && item.endsWith('.md')) {
                processFile(fullPath);
            }
        }
    }

    // Scan main areas
    scanDirectory(DOCS_DIR);
    scanDirectory(FRONTEND_DIR);
    
    // Process root markdown files
    const rootMdFiles = ['README.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE.md'];
    for (const file of rootMdFiles) {
        const fullPath = path.join(REPO_ROOT, file);
        if (fs.existsSync(fullPath)) {
            processFile(fullPath);
        }
    }

    // Sort largest files
    stats.largestFiles.sort((a, b) => b.size - a.size);
    stats.largestFiles = stats.largestFiles.slice(0, 10);

    return stats;
}

function checkLinkHealth() {
    log('🔗 Checking link health...', 'blue');
    
    try {
        // Run link monitoring script
        execSync(`cd "${FRONTEND_DIR}" && ../scripts/utils/monitor-docs-links.sh`, {
            stdio: 'pipe'
        });
        
        // Parse link check results
        const linkReports = [];
        if (fs.existsSync(REPORTS_DIR)) {
            const logFiles = fs.readdirSync(REPORTS_DIR).filter(f => f.endsWith('.log'));
            
            for (const logFile of logFiles) {
                const content = fs.readFileSync(path.join(REPORTS_DIR, logFile), 'utf8');
                const brokenLinks = content.match(/\[✖\]/g)?.length || 0;
                const totalLinks = content.match(/\[✓\]|\[✖\]/g)?.length || 0;
                
                linkReports.push({
                    file: logFile.replace('.log', ''),
                    totalLinks,
                    brokenLinks,
                    healthScore: totalLinks > 0 ? ((totalLinks - brokenLinks) / totalLinks * 100).toFixed(1) : 100
                });
            }
        }
        
        return linkReports;
    } catch (error) {
        log(`⚠️  Link checking failed: ${error.message}`, 'yellow');
        return [];
    }
}

function generateSearchIndex() {
    log('🔍 Generating search index...', 'blue');
    
    try {
        execSync(`cd "${FRONTEND_DIR}" && ../scripts/utils/generate-search-index.sh`, {
            stdio: 'pipe'
        });
        
        const searchIndexPath = path.join(FRONTEND_DIR, 'public', 'search', 'index.json');
        if (fs.existsSync(searchIndexPath)) {
            const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
            return {
                documentsIndexed: searchIndex.length,
                indexSize: fs.statSync(searchIndexPath).size,
                generated: true
            };
        }
    } catch (error) {
        log(`⚠️  Search index generation failed: ${error.message}`, 'yellow');
    }
    
    return { generated: false };
}

function runMarkdownLinting() {
    log('📝 Running markdown linting...', 'blue');
    
    try {
        execSync(`cd "${FRONTEND_DIR}" && npm run lint:md`, {
            stdio: 'pipe'
        });
        return { passed: true, errors: 0 };
    } catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        const errorMatch = output.match(/Summary: (\d+) error\(s\)/);
        const errors = errorMatch ? parseInt(errorMatch[1]) : 1;
        
        return { passed: false, errors };
    }
}

function generateHealthDashboard(stats, linkHealth, searchInfo, lintResults) {
    const timestamp = new Date().toISOString();
    const dashboardPath = path.join(REPORTS_DIR, `health-dashboard-${Date.now()}.html`);
    
    const totalBrokenLinks = linkHealth.reduce((sum, report) => sum + report.brokenLinks, 0);
    const totalLinks = linkHealth.reduce((sum, report) => sum + report.totalLinks, 0);
    const overallLinkHealth = totalLinks > 0 ? ((totalLinks - totalBrokenLinks) / totalLinks * 100).toFixed(1) : 100;
    
    const healthScore = (
        (lintResults.passed ? 25 : 0) +
        (overallLinkHealth > 90 ? 25 : overallLinkHealth > 75 ? 20 : overallLinkHealth > 50 ? 15 : 10) +
        (searchInfo.generated ? 25 : 0) +
        (stats.totalFiles > 0 ? 25 : 0)
    );

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation Health Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header .subtitle {
            opacity: 0.9;
            margin-top: 10px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        .metric {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            border-left: 4px solid #007acc;
        }
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .metric-label {
            color: #666;
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 1px;
        }
        .health-score {
            background: ${healthScore >= 80 ? '#4caf50' : healthScore >= 60 ? '#ff9800' : '#f44336'};
            color: white;
            border-left-color: transparent;
        }
        .sections {
            padding: 0 30px 30px;
        }
        .section {
            margin-bottom: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            overflow: hidden;
        }
        .section-header {
            background: #007acc;
            color: white;
            padding: 15px 20px;
            font-weight: bold;
        }
        .section-content {
            padding: 20px;
        }
        .link-report {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 15px;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .link-report:last-child {
            border-bottom: none;
        }
        .health-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 10px;
        }
        .health-good { background: #4caf50; }
        .health-warning { background: #ff9800; }
        .health-error { background: #f44336; }
        .file-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .file-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
        }
        .timestamp {
            text-align: center;
            color: #666;
            font-size: 0.9em;
            padding: 20px;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>📊 Documentation Health Dashboard</h1>
            <div class="subtitle">Real-time monitoring of documentation quality and health</div>
        </div>
        
        <div class="metrics">
            <div class="metric health-score">
                <div class="metric-value">${healthScore}%</div>
                <div class="metric-label">Overall Health Score</div>
            </div>
            
            <div class="metric">
                <div class="metric-value">${stats.totalFiles}</div>
                <div class="metric-label">Total Documents</div>
            </div>
            
            <div class="metric">
                <div class="metric-value">${(stats.totalSize / 1024).toFixed(1)}KB</div>
                <div class="metric-label">Total Size</div>
            </div>
            
            <div class="metric">
                <div class="metric-value">${overallLinkHealth}%</div>
                <div class="metric-label">Link Health</div>
            </div>
        </div>
        
        <div class="sections">
            <div class="section">
                <div class="section-header">📝 Markdown Linting Results</div>
                <div class="section-content">
                    <div class="link-report">
                        <div>
                            <span class="health-indicator ${lintResults.passed ? 'health-good' : 'health-error'}"></span>
                            Markdown Formatting
                        </div>
                        <div>${lintResults.passed ? 'PASSED' : 'FAILED'}</div>
                        <div>${lintResults.errors} errors</div>
                        <div>${lintResults.passed ? '100%' : '0%'} compliance</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">🔗 Link Health Reports</div>
                <div class="section-content">
                    ${linkHealth.map(report => `
                        <div class="link-report">
                            <div>
                                <span class="health-indicator ${report.healthScore > 90 ? 'health-good' : report.healthScore > 75 ? 'health-warning' : 'health-error'}"></span>
                                ${report.file}
                            </div>
                            <div>${report.totalLinks} links</div>
                            <div>${report.brokenLinks} broken</div>
                            <div>${report.healthScore}% healthy</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">🔍 Search Index Status</div>
                <div class="section-content">
                    <div class="link-report">
                        <div>
                            <span class="health-indicator ${searchInfo.generated ? 'health-good' : 'health-error'}"></span>
                            Search Index Generation
                        </div>
                        <div>${searchInfo.generated ? 'GENERATED' : 'FAILED'}</div>
                        <div>${searchInfo.documentsIndexed || 0} docs</div>
                        <div>${searchInfo.generated ? '100%' : '0%'} coverage</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">📁 Largest Documentation Files</div>
                <div class="section-content">
                    <div class="file-list">
                        ${stats.largestFiles.map(file => `
                            <div class="file-item">
                                <span>${file.path}</span>
                                <span>${(file.size / 1024).toFixed(1)}KB</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="timestamp">
            Generated on ${new Date(timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(dashboardPath, html);
    return dashboardPath;
}

function main() {
    log('🚀 Starting Documentation Health Check...', 'cyan');
    log('=' .repeat(50), 'cyan');
    
    const stats = getDocumentationStats();
    const linkHealth = checkLinkHealth();
    const searchInfo = generateSearchIndex();
    const lintResults = runMarkdownLinting();
    
    const dashboardPath = generateHealthDashboard(stats, linkHealth, searchInfo, lintResults);
    
    log('=' .repeat(50), 'cyan');
    log('📊 Health Check Complete!', 'green');
    log(`📝 Total Documents: ${stats.totalFiles}`, 'blue');
    log(`🔗 Link Health: ${linkHealth.length} files checked`, 'blue');
    log(`🔍 Search Index: ${searchInfo.generated ? 'Generated' : 'Failed'}`, 'blue');
    log(`📋 Linting: ${lintResults.passed ? 'Passed' : `Failed (${lintResults.errors} errors)`}`, 'blue');
    log(`📊 Dashboard: ${dashboardPath}`, 'magenta');
    log('=' .repeat(50), 'cyan');
}

if (require.main === module) {
    main();
}

module.exports = {
    getDocumentationStats,
    checkLinkHealth,
    generateSearchIndex,
    runMarkdownLinting,
    generateHealthDashboard
};
