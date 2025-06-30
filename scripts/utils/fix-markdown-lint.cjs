#!/usr/bin/env node

/**
 * Markdown Lint Fixer for ThinkRED
 * Fixes common markdown linting issues automatically
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

class MarkdownLintFixer {
  constructor() {
    this.fixedFiles = 0;
    this.totalIssues = 0;
  }

  /**
   * Fixes common markdown issues in a file
   * @param {string} filePath - Path to the markdown file
   */
  fixMarkdownFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, "utf8");
      let issuesFixed = 0;
      const originalContent = content;

      // Fix MD022: Add blank lines around headings
      content = content.replace(/^(#+\s.+)$/gm, (match, heading, offset) => {
        const lines = content.substring(0, offset).split("\n");
        const nextLines = content.substring(offset).split("\n");

        let result = heading;

        // Check if we need a blank line before
        if (lines.length > 1 && lines[lines.length - 2].trim() !== "") {
          result = "\n" + result;
          issuesFixed++;
        }

        // Check if we need a blank line after
        if (nextLines.length > 1 && nextLines[1].trim() !== "") {
          result = result + "\n";
          issuesFixed++;
        }

        return result;
      });

      // Fix MD026: Remove trailing punctuation from headings
      content = content.replace(/^(#+\s.+)[:.]$/gm, (match, heading) => {
        issuesFixed++;
        return heading;
      });

      // Fix excessive blank lines (keep max 2 consecutive)
      content = content.replace(/\n{3,}/g, "\n\n");

      // Ensure file ends with single newline
      content = content.replace(/\n*$/, "\n");

      // Only write if content changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        this.fixedFiles++;
        this.totalIssues += issuesFixed;
        console.log(
          `✅ Fixed ${issuesFixed} issues in: ${path.relative(process.cwd(), filePath)}`,
        );
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }

  /**
   * Fix all markdown files in the project
   */
  fixAllMarkdownFiles() {
    console.log("🔧 Starting markdown lint fixes...\n");

    // Find all markdown files
    const patterns = ["reports/**/*.md", "docs/**/*.md", "*.md"];

    const excludePatterns = ["node_modules/**", "build/**", ".git/**"];

    for (const pattern of patterns) {
      const files = glob.sync(pattern, {
        ignore: excludePatterns,
        absolute: true,
      });

      for (const file of files) {
        this.fixMarkdownFile(file);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Files processed: ${this.fixedFiles}`);
    console.log(`   Issues fixed: ${this.totalIssues}`);
    console.log(`✨ Markdown linting fixes complete!`);
  }
}

// Main execution
if (require.main === module) {
  // Check if glob is available
  try {
    require.resolve("glob");
  } catch (e) {
    console.log("Installing required dependency: glob");
    require("child_process").execSync("npm install glob", { stdio: "inherit" });
  }

  const fixer = new MarkdownLintFixer();
  fixer.fixAllMarkdownFiles();
}

module.exports = MarkdownLintFixer;
