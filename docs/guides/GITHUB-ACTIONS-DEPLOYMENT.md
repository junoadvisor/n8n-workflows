# GitHub Actions Deployment Guide

**Last Updated:** 2026-06-08  
**Status:** Production Ready  

This guide explains how to use GitHub Actions to automatically deploy n8n workflows to n8n Cloud.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## Overview

The GitHub Actions workflow automates deployment of n8n workflows to n8n Cloud. It supports:

- ✅ **Deploy All Workflows** - Deploy all 16 workflows across 7 integrations
- ✅ **Deploy by Integration** - Deploy specific integration (toast, google, yelp, etc.)
- ✅ **Deploy Single Workflow** - Deploy one specific workflow file
- ✅ **Auto-deployment** - Automatically deploy on push to main branch
- ✅ **Manual Trigger** - Manually trigger deployment from GitHub Actions UI
- ✅ **Update Existing** - Automatically update workflows if they already exist
- ✅ **Error Handling** - Comprehensive error handling and reporting

---

## Prerequisites

### 1. n8n Cloud Account

- Sign up at [n8n.cloud](https://n8n.cloud)
- Create a workspace
- Note your workspace URL (e.g., `https://your-workspace.app.n8n.cloud`)

### 2. n8n API Key

Generate an API key from your n8n Cloud workspace:

1. Go to **Settings** > **API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "GitHub Actions Deployment")
4. Copy the API key (you won't be able to see it again)

### 3. GitHub Repository

- Push this repository to GitHub
- Ensure you have admin access to configure secrets

---

## Setup

### Step 1: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

#### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `N8N_CLOUD_URL` | Your n8n Cloud workspace URL | `https://your-workspace.app.n8n.cloud` |
| `N8N_API_KEY` | Your n8n Cloud API key | `n8n_api_abc123...` |

**Example:**

```
Secret: N8N_CLOUD_URL
Value: https://mycompany.app.n8n.cloud

Secret: N8N_API_KEY
Value: n8n_api_1234567890abcdef
```

### Step 2: Verify Workflow File

The workflow file is located at:
```
.github/workflows/deploy-n8n.yml
```

It should be automatically committed to your repository.

### Step 3: Enable GitHub Actions

1. Go to **Settings** > **Actions** > **General**
2. Under **Actions permissions**, select:
   - ✅ "Allow all actions and reusable workflows"
3. Click **Save**

---

## Usage

### Option 1: Manual Deployment (Recommended for First Time)

1. Go to **Actions** tab in your GitHub repository
2. Click **Deploy n8n Workflows** in the left sidebar
3. Click **Run workflow** button (top right)
4. Configure deployment:

#### Deploy All Workflows
```
Deployment Type: all
Workflow File: (leave empty)
```

#### Deploy Specific Integration
```
Deployment Type: toast (or google, yelp, opentable, resy, instagram, facebook)
Workflow File: (leave empty)
```

#### Deploy Single Workflow
```
Deployment Type: single
Workflow File: toast/post-toast-order-workflow.json
```

5. Click **Run workflow**
6. Monitor the deployment in the Actions tab

### Option 2: Automatic Deployment

Workflows are automatically deployed when:

- **Push to main branch** with changes to `.json` files
- **Pull request merged** to main branch

Example:
```bash
# Make changes to a workflow
nano toast/post-toast-order-workflow.json

# Commit and push
git add toast/post-toast-order-workflow.json
git commit -m "feat: Update Toast order workflow"
git push origin main

# Deployment automatically triggers
```

---

## Deployment Options

### 1. Deploy All Workflows

Deploys all 16 workflows across 7 integrations:

**GitHub Actions UI:**
```
Deployment Type: all
```

**Result:**
- 4 Toast workflows
- 2 Google workflows
- 2 Yelp workflows
- 1 OpenTable workflow
- 1 Resy workflow
- 3 Instagram workflows
- 3 Facebook workflows

### 2. Deploy by Integration

Deploy all workflows for a specific integration:

**Available Options:**
- `toast` - Deploy all Toast POS workflows (4)
- `google` - Deploy all Google Business Profile workflows (2)
- `yelp` - Deploy all Yelp workflows (2)
- `opentable` - Deploy OpenTable workflows (1)
- `resy` - Deploy Resy workflows (1)
- `instagram` - Deploy Instagram workflows (3)
- `facebook` - Deploy Facebook workflows (3)

**Example:**
```
Deployment Type: toast
```

### 3. Deploy Single Workflow

Deploy one specific workflow file:

**Example:**
```
Deployment Type: single
Workflow File: google/put-google-review-reply-workflow.json
```

**Valid Workflow Paths:**

**Toast:**
- `toast/post-toast-order-workflow.json`
- `toast/get-toast-order-workflow.json`
- `toast/get-toast-menu-workflow.json`
- `toast/get-toast-restaurants-workflow.json`

**Google:**
- `google/get-google-reviews-workflow.json`
- `google/put-google-review-reply-workflow.json`

**Yelp:**
- `yelp/get-yelp-reviews-workflow.json`
- `yelp/put-yelp-review-reply-workflow.json`

**OpenTable:**
- `opentable/get-opentable-reservations-workflow.json`

**Resy:**
- `resy/get-resy-reservations-workflow.json`

**Instagram:**
- `instagram/post-instagram-content-workflow.json`
- `instagram/post-instagram-comment-workflow.json`
- `instagram/put-instagram-comment-reply-workflow.json`

**Facebook:**
- `facebook/post-facebook-content-workflow.json`
- `facebook/post-facebook-comment-workflow.json`
- `facebook/put-facebook-comment-reply-workflow.json`

---

## How It Works

### Deployment Process

1. **Checkout code** - Fetches the repository
2. **Setup Node.js** - Installs Node.js 20
3. **Validate environment** - Checks for required secrets
4. **Determine scope** - Decides which workflows to deploy
5. **Deploy workflows** - For each workflow:
   - Read the JSON file
   - Extract workflow name
   - Check if workflow exists in n8n Cloud
   - **If exists:** Update (PATCH request)
   - **If new:** Create (POST request)
   - Log success/failure
6. **Generate summary** - Create deployment report

### API Endpoints Used

**List Workflows:**
```
GET https://your-workspace.app.n8n.cloud/api/v1/workflows
```

**Create Workflow:**
```
POST https://your-workspace.app.n8n.cloud/api/v1/workflows
Body: {workflow JSON}
```

**Update Workflow:**
```
PATCH https://your-workspace.app.n8n.cloud/api/v1/workflows/{id}
Body: {workflow JSON}
```

---

## Monitoring Deployment

### View Deployment Status

1. Go to **Actions** tab
2. Click on the running workflow
3. Click on **Deploy to n8n Cloud** job
4. View real-time logs

### Deployment Logs

The workflow logs show:
- ✅ Successfully deployed workflows
- ❌ Failed deployments with error messages
- 📊 Deployment summary with counts

**Example Output:**
```
🚀 Deploying: toast/post-toast-order-workflow.json
🔍 Checking if workflow exists: Post Toast Order Workflow
♻️  Updating existing workflow (ID: 123)
✅ Successfully updated: Post Toast Order Workflow (ID: 123)

=========================================
📊 Deployment Summary
=========================================
✅ Successful: 16
❌ Failed: 0
=========================================
```

### GitHub Deployment Summary

After each deployment, view the summary:
1. Go to the completed workflow run
2. Scroll to **Summary** section
3. View deployment details

---

## Troubleshooting

### Issue: Missing N8N_CLOUD_URL Secret

**Error:**
```
❌ Error: N8N_CLOUD_URL secret is not set
```

**Solution:**
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Add `N8N_CLOUD_URL` secret with your workspace URL
3. Example: `https://mycompany.app.n8n.cloud`

### Issue: Missing N8N_API_KEY Secret

**Error:**
```
❌ Error: N8N_API_KEY secret is not set
```

**Solution:**
1. Go to n8n Cloud > **Settings** > **API Keys**
2. Create new API key
3. Add `N8N_API_KEY` secret in GitHub with the key value

### Issue: Unauthorized (401)

**Error:**
```
❌ Failed to create workflow: Unauthorized
```

**Solution:**
1. Verify API key is correct
2. Check if API key has been revoked
3. Generate new API key if needed

### Issue: Workflow Not Found

**Error:**
```
❌ Error: Workflow file not found: toast/invalid.json
```

**Solution:**
- Verify the workflow file path is correct
- Ensure the file exists in the repository
- Use correct folder structure: `{integration}/{workflow}.json`

### Issue: Invalid Workflow JSON

**Error:**
```
❌ Failed to create workflow: Invalid JSON
```

**Solution:**
1. Validate JSON syntax: `jq . workflow.json`
2. Check for required fields: `name`, `nodes`, `connections`
3. Test workflow import in n8n UI first

### Issue: Deployment Partially Failed

**Example:**
```
✅ Successful: 14
❌ Failed: 2
```

**Solution:**
1. Review the deployment logs
2. Identify which workflows failed
3. Fix the failed workflows
4. Re-run deployment for failed workflows only:
   - Use "single" deployment type
   - Specify the failed workflow file

---

## Security Best Practices

### 1. Protect Secrets

- ✅ Never commit API keys to the repository
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate API keys regularly (every 90 days)
- ✅ Use separate API keys for dev/staging/production

### 2. Branch Protection

1. Go to **Settings** > **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution

### 3. Workflow Permissions

The workflow uses minimal permissions:
- ✅ `contents: read` - Read repository content
- ❌ No write access to repository
- ❌ No access to other repositories

### 4. API Key Permissions

In n8n Cloud, create API key with minimal permissions:
- ✅ `workflow:create`
- ✅ `workflow:read`
- ✅ `workflow:update`
- ❌ `workflow:delete` (optional, not needed)

---

## Advanced Usage

### Deploy on Schedule

Add scheduled deployment to `.github/workflows/deploy-n8n.yml`:

```yaml
on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2 AM UTC
```

### Deploy to Multiple Environments

Create separate workflows for each environment:
- `.github/workflows/deploy-n8n-dev.yml`
- `.github/workflows/deploy-n8n-staging.yml`
- `.github/workflows/deploy-n8n-production.yml`

Use different secrets:
- `N8N_CLOUD_URL_DEV`
- `N8N_CLOUD_URL_STAGING`
- `N8N_CLOUD_URL_PRODUCTION`

### Slack Notifications

Add Slack notification step:

```yaml
- name: Send Slack notification
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "✅ n8n workflows deployed successfully"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Best Practices

### 1. Test Before Deploying

- Test workflow changes in n8n UI first
- Export tested workflow and commit to repository
- Deploy via GitHub Actions

### 2. Use Pull Requests

- Create feature branch: `git checkout -b feature/update-toast-workflow`
- Make changes
- Create pull request
- Review changes
- Merge to main → auto-deploy

### 3. Monitor Deployments

- Check GitHub Actions tab regularly
- Review deployment summaries
- Set up notifications for failures

### 4. Version Control

- Tag releases: `git tag -a v1.0.0 -m "Release 1.0.0"`
- Document changes in CHANGELOG.md
- Link workflow versions to git tags

---

## API Rate Limits

n8n Cloud API rate limits:
- **Free Plan:** 60 requests/minute
- **Starter Plan:** 300 requests/minute
- **Pro Plan:** 600 requests/minute

**Note:** Deploying all 16 workflows uses 16-32 API requests (depending on updates vs creates).

---

## Files

- `.github/workflows/deploy-n8n.yml` - GitHub Actions workflow
- `docs/guides/GITHUB-ACTIONS-DEPLOYMENT.md` - This file

---

## Related Documentation

- [n8n Cloud API Documentation](https://docs.n8n.io/api/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Last Updated:** 2026-06-08  
**Status:** ✅ Production Ready  
**Tested With:** n8n Cloud v1.0+, GitHub Actions v4
