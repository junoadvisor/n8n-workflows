# Workspace Setup and Directory Rules

## ⚠️ Critical: Correct Working Directory

**ALL n8n workflow development MUST happen in:**

```
/Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows
```

## ❌ Wrong Directory (DO NOT USE)

The following directory is **NOT** for n8n workflows:

```
/Users/svallamkonda/Documents/GitLab/junoadvisor-v2/juno-auditor-database
```

This is a different project (Juno Advisor Database). Do not create or modify n8n workflow files there.

---

## 📁 Correct Directory Structure

```
/Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows/
├── .cursor/
│   └── rules/
│       ├── n8n-workflows.md          # Development guidelines
│       └── WORKSPACE-SETUP.md        # This file
│
├── tests/                            # Test scripts
│   ├── test-workflows.js
│   ├── mock-server.js
│   └── README.md
│
├── docs/                             # Documentation
│   ├── README.md
│   ├── guides/
│   ├── reference/
│   └── scripts/
│
├── toast/                            # Toast POS workflows
│   ├── post-toast-order-workflow.json
│   ├── get-toast-order-workflow.json
│   ├── get-toast-menu-workflow.json
│   └── README.md
│
├── google/                           # Google Business Profile workflows
│   ├── get-google-reviews-workflow.json
│   ├── put-google-review-reply-workflow.json
│   └── README.md
│
├── yelp/                             # Yelp Fusion API workflows
│   ├── get-yelp-reviews-workflow.json
│   └── README.md
│
├── opentable/                        # OpenTable workflows
│   ├── get-opentable-reservations-workflow.json
│   └── README.md
│
├── resy/                             # Resy workflows
│   ├── get-resy-reservations-workflow.json
│   └── README.md
│
├── instagram/                        # Instagram workflows
│   ├── post-instagram-content-workflow.json
│   ├── post-instagram-comment-workflow.json
│   └── README.md
│
├── facebook/                         # Facebook workflows
│   ├── post-facebook-content-workflow.json
│   ├── post-facebook-comment-workflow.json
│   └── README.md
│
├── README.md                         # Main project overview
├── CHANGELOG.md                      # Version history
└── DEVELOPMENT-STATUS.md             # Project status
```

---

## 🔧 For AI Assistants / Agents

When working on n8n workflows:

1. **Always verify working directory** before creating or modifying files
2. **Use absolute paths** when in doubt:
   ```
   /Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows
   ```
3. **Check workspace context** at the start of each session
4. **Do not mix projects** - Keep n8n workflows separate from database projects

---

## ✅ Verification Commands

Run these to verify you're in the correct directory:

```bash
# Check current directory
pwd
# Should output: /Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows

# Verify workflow folders exist
ls -d toast google yelp opentable resy instagram facebook
# Should list all 7 folders

# Count workflow files
find . -name "*.json" -path "*/[!.]/*" | wc -l
# Should output: 12
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong: Creating files in junoadvisor-v2/juno-auditor-database
```bash
# DO NOT DO THIS
cd /Users/svallamkonda/Documents/GitLab/junoadvisor-v2/juno-auditor-database/toast
# Creating workflows here is WRONG
```

### ✅ Correct: Creating files in neuraltable-2/n8n-workflows
```bash
# DO THIS
cd /Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows/toast
# Creating workflows here is CORRECT
```

---

## 📋 Project Separation

| Project | Directory | Purpose |
|---------|-----------|---------|
| **n8n Workflows** | `/Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows` | Workflow automation, integrations |
| **Juno Auditor Database** | `/Users/svallamkonda/Documents/GitLab/junoadvisor-v2/juno-auditor-database` | Database schemas, migrations |
| **NeuralTable Public Site** | `/Users/svallamkonda/Documents/GitLab/neuraltable-2/neuraltable-public-site` | Marketing website |
| **NeuralTable Customer App** | `/Users/svallamkonda/Documents/GitLab/neuraltable-2/neuraltable-customer-app` | Customer application |

**Keep these separate!** Do not mix workflow files with database files.

---

## 🔄 Migration Completed

**Date**: 2026-06-08

All workflow files have been moved from the wrong directory to the correct directory:

- ✅ Toast workflows (3 files) - Moved and verified
- ✅ Google workflows (2 files) - Already in correct location
- ✅ Yelp workflows (1 file) - Already in correct location
- ✅ OpenTable workflows (1 file) - Already in correct location
- ✅ Resy workflows (1 file) - Already in correct location
- ✅ Instagram workflows (2 files) - Already in correct location
- ✅ Facebook workflows (2 files) - Already in correct location

**Total**: 12 workflows across 7 providers, all in correct location.

---

## 📝 Notes for Future Sessions

When starting a new chat or coding session:

1. Run `pwd` to verify working directory
2. If in wrong directory, run:
   ```bash
   cd /Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows
   ```
3. Verify with `ls -la` to see workflow folders
4. Proceed with confidence

---

**Remember**: `/Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows` is the **only** correct directory for n8n workflow development.
