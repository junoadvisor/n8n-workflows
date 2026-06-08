# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD automation.

## Available Workflows

### 1. Deploy n8n Workflows
**File:** `workflows/deploy-n8n.yml`

Automates deployment of n8n workflows to n8n Cloud.

#### Triggers
- **Manual:** Run workflow from Actions tab
- **Automatic:** Push to main branch (JSON files only)
- **PR Merge:** Pull request merged to main

#### Deployment Options
- Deploy all 16 workflows
- Deploy by integration (toast, google, yelp, etc.)
- Deploy single workflow file

#### Required Secrets
- `N8N_CLOUD_URL` - Your n8n Cloud workspace URL
- `N8N_API_KEY` - Your n8n Cloud API key

#### Quick Start
1. Configure GitHub Secrets in repository settings
2. Go to Actions tab
3. Select "Deploy n8n Workflows"
4. Click "Run workflow"
5. Choose deployment type
6. Monitor deployment progress

#### Documentation
See [GitHub Actions Deployment Guide](../docs/guides/GITHUB-ACTIONS-DEPLOYMENT.md) for complete instructions.

---

## Adding New Workflows

To add new GitHub Actions workflows:

1. Create new YAML file in `workflows/` directory
2. Follow GitHub Actions syntax
3. Add required secrets in repository settings
4. Test workflow in feature branch first
5. Document workflow in this README

---

## Workflow Permissions

All workflows use minimal permissions:
- `contents: read` - Read repository content
- No write access to repository
- No access to other repositories

---

## Security

- Never commit secrets or API keys
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly (every 90 days)
- Review workflow logs for exposed secrets
- Enable branch protection on main

---

**Last Updated:** 2026-06-08  
**Documentation:** [docs/guides/GITHUB-ACTIONS-DEPLOYMENT.md](../docs/guides/GITHUB-ACTIONS-DEPLOYMENT.md)
