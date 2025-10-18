#!/usr/bin/env node
/**
 * Security Check Script
 * Verifies that no hardcoded credentials exist in the codebase
 */

const fs = require("fs");
const path = require("path");

const PATTERNS_TO_CHECK = [
  // Firebase patterns
  { pattern: /AIzaSy[A-Za-z0-9_-]{33}/, name: "Firebase API Key" },
  { pattern: /[0-9]+:[0-9]+:web:[a-zA-Z0-9]+/, name: "Firebase App ID" },
  { pattern: /G-[A-Z0-9]{10}/, name: "Firebase Measurement ID" },

  // MongoDB patterns
  {
    pattern: /mongodb\+srv:\/\/[^:]+:[^@]+@/,
    name: "MongoDB Connection String",
  },

  // Generic API keys
  { pattern: /['"]([a-zA-Z0-9]{32,})['"]/, name: "Potential API Key" },

  // JWT secrets
  { pattern: /JWT_SECRET\s*=\s*['"][^'"]+['"]/, name: "JWT Secret" },
];

const EXCLUDED_DIRS = ["node_modules", ".next", "out", "build", ".git"];

const EXCLUDED_FILES = [
  ".env.example",
  "SECURITY-FIX-REPORT.md",
  "check-security.js",
];

function checkFile(filePath) {
  const fileName = path.basename(filePath);

  // Skip excluded files
  if (EXCLUDED_FILES.includes(fileName)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8");
  const findings = [];

  PATTERNS_TO_CHECK.forEach(({ pattern, name }) => {
    const matches = content.match(new RegExp(pattern, "g"));
    if (matches) {
      // Filter out environment variable references
      const actualMatches = matches.filter(
        (match) =>
          !match.includes("process.env") &&
          !match.includes("NEXT_PUBLIC_") &&
          !match.includes("example") &&
          !match.includes("your-") &&
          !match.includes("placeholder")
      );

      if (actualMatches.length > 0) {
        findings.push({
          file: filePath,
          type: name,
          matches: actualMatches.length,
        });
      }
    }
  });

  return findings;
}

function scanDirectory(dir, findings = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        scanDirectory(fullPath, findings);
      }
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".js") ||
        entry.name.endsWith(".ts") ||
        entry.name.endsWith(".jsx") ||
        entry.name.endsWith(".tsx"))
    ) {
      const fileFindings = checkFile(fullPath);
      findings.push(...fileFindings);
    }
  }

  return findings;
}

console.log("🔍 Scanning codebase for hardcoded credentials...\n");

const projectRoot = process.cwd();
const findings = scanDirectory(projectRoot);

if (findings.length === 0) {
  console.log("✅ No hardcoded credentials found!");
  console.log("✅ Security check passed!\n");
  process.exit(0);
} else {
  console.log("⚠️  WARNING: Potential hardcoded credentials found:\n");

  findings.forEach(({ file, type, matches }) => {
    const relativePath = path.relative(projectRoot, file);
    console.log(`  ❌ ${relativePath}`);
    console.log(
      `     Type: ${type} (${matches} match${matches > 1 ? "es" : ""})\n`
    );
  });

  console.log(
    "⚠️  Please review these files and move credentials to .env.local\n"
  );
  process.exit(1);
}
