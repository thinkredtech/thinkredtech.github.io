#!/usr/bin/env node

/**
 * Report Formatting Utilities
 *
 * Utilities for generating consistently formatted Markdown tables and progress bars
 * for health reports and status dashboards.
 */

/**
 * Generates a clean Markdown table with consistent formatting
 * @param {Array} headers - Array of header strings
 * @param {Array} rows - Array of row arrays
 * @param {Array} alignments - Array of alignment options ('left', 'center', 'right')
 */
function generateMarkdownTable(headers, rows, alignments = []) {
  if (!headers || !rows || headers.length === 0) return "";

  // Create header row
  let table = "| " + headers.join(" | ") + " |\n";

  // Create separator row with alignments
  const separators = headers.map((_, index) => {
    const align = alignments[index] || "left";
    switch (align) {
      case "center":
        return ":---:";
      case "right":
        return "---:";
      default:
        return "---";
    }
  });
  table += "| " + separators.join(" | ") + " |\n";

  // Add data rows
  rows.forEach((row) => {
    // Ensure row has same number of columns as headers
    const paddedRow = [...row];
    while (paddedRow.length < headers.length) {
      paddedRow.push("");
    }
    table += "| " + paddedRow.slice(0, headers.length).join(" | ") + " |\n";
  });

  return table;
}

/**
 * Generates a progress bar with consistent width
 * @param {number} percentage - Progress percentage (0-100)
 * @param {number} width - Progress bar width (default: 20)
 */
function generateProgressBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  const fullBlocks = "█".repeat(filled);
  const emptyBlocks = "▒".repeat(empty);

  return fullBlocks + emptyBlocks;
}

/**
 * Generates a metrics dashboard using Markdown table
 */
function generateMetricsDashboard(metrics, title = "Metrics Dashboard") {
  if (!metrics || metrics.length === 0) return "";

  const headers = ["📊 Metric", "Progress", "Value", "Status"];
  const alignments = ["left", "left", "center", "left"];

  const rows = metrics.map((metric) => [
    metric.label,
    `\`${generateProgressBar(metric.percentage, 20)}\``,
    metric.value,
    metric.status,
  ]);

  return `### ${title}\n\n${generateMarkdownTable(headers, rows, alignments)}`;
}

/**
 * Generates a status board using Markdown table
 */
function generateStatusBoard(services, title = "System Status Board") {
  if (!services || services.length === 0) return "";

  const headers = ["🎯 Service", "Status", "Health", "Metric", "Details"];
  const alignments = ["left", "center", "left", "center", "left"];

  const rows = services.map((service) => [
    `${service.icon} ${service.name}`,
    service.status,
    `\`${generateProgressBar(service.health, 15)}\``,
    service.metric,
    service.details,
  ]);

  return `### ${title}\n\n${generateMarkdownTable(headers, rows, alignments)}`;
}

/**
 * Generates historical trend charts using Markdown table
 */
function generateTrendChart(data, title, unit = "") {
  if (!data || data.length === 0) return "";

  const headers = ["📅 Period", "Trend", "Value", "Status"];
  const alignments = ["left", "left", "center", "center"];

  const rows = data.map((item) => [
    item.period,
    `\`${generateProgressBar(item.percentage, 20)}\``,
    `${item.value}${unit}`,
    item.status,
  ]);

  // Add summary row if data exists
  if (data.length > 0) {
    const avgValue =
      data.reduce((sum, item) => sum + parseFloat(item.value), 0) / data.length;
    rows.push(["**Average**", "", `**${avgValue.toFixed(1)}${unit}**`, ""]);
  }

  return `### ${title}\n\n${generateMarkdownTable(headers, rows, alignments)}`;
}

/**
 * Creates a simple summary table for key metrics
 */
function generateSummaryTable(metrics) {
  if (!metrics || metrics.length === 0) return "";

  const headers = ["Metric", "Value"];
  const alignments = ["left", "right"];

  const rows = metrics.map((metric) => [`**${metric.label}**`, metric.value]);

  return generateMarkdownTable(headers, rows, alignments);
}

/**
 * Template replacement function
 */
function replaceTemplateVariables(template, variables) {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, "g"), value);
  });
  return result;
}

/**
 * Example usage and test data
 */
function generateExampleStatusDashboard() {
  const services = [
    {
      icon: "🌐",
      name: "Website",
      status: "🟢 Operational",
      health: 95,
      metric: "850ms",
      details: "Main site accessibility",
    },
    {
      icon: "🏗️",
      name: "Build Pipeline",
      status: "🟢 Healthy",
      health: 100,
      metric: "2m15s",
      details: "Automated deployment",
    },
    {
      icon: "⚡",
      name: "Performance",
      status: "🟢 Optimized",
      health: 88,
      metric: "986KB",
      details: "Bundle optimization",
    },
    {
      icon: "🛡️",
      name: "Security",
      status: "🟢 Secure",
      health: 100,
      metric: "0 vuln",
      details: "Vulnerability monitoring",
    },
  ];

  const metrics = [
    {
      label: "Response Time",
      percentage: 85,
      value: "850ms",
      status: "🟢 Fast",
    },
    {
      label: "Bundle Size",
      percentage: 98,
      value: "986KB",
      status: "🟢 Optimal",
    },
    { label: "Build Time", percentage: 75, value: "135s", status: "🟢 Good" },
    { label: "Error Rate", percentage: 100, value: "0%", status: "🟢 Perfect" },
    { label: "Uptime", percentage: 99, value: "99.9%", status: "🟢 Excellent" },
  ];

  const trendData = [
    { period: "Week 1", percentage: 99.8, value: "99.8", status: "🟢" },
    { period: "Week 2", percentage: 99.9, value: "99.9", status: "🟢" },
    { period: "Week 3", percentage: 100.0, value: "100.0", status: "🟢" },
    { period: "Week 4", percentage: 99.9, value: "99.9", status: "🟢" },
  ];

  console.log("## 🚀 System Status Example\n");
  console.log("🟢 ALL SYSTEMS OPERATIONAL");
  console.log(`\`${generateProgressBar(100, 40)}\` 100% HEALTHY\n`);
  console.log(generateStatusBoard(services));
  console.log();
  console.log(generateMetricsDashboard(metrics, "Performance Dashboard"));
  console.log();
  console.log(
    generateTrendChart(trendData, "30-Day Performance History", "% uptime"),
  );
}

module.exports = {
  generateMarkdownTable,
  generateProgressBar,
  generateMetricsDashboard,
  generateStatusBoard,
  generateTrendChart,
  generateSummaryTable,
  replaceTemplateVariables,
  generateExampleStatusDashboard,
};

// Run example if called directly
if (require.main === module) {
  generateExampleStatusDashboard();
}
