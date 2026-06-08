# Quick Reference Guide

Fast access to common commands, endpoints, and configurations.

---

## 🚀 Quick Start

### 1. Verify Authentication Configuration
```bash
python3 docs/scripts/verify-authentication.py
```

### 2. Import Workflows to n8n
1. Open n8n web interface
2. Go to Workflows → Import from File
3. Select workflow JSON from provider folders
4. Assign credentials to HTTP Request nodes
5. Activate workflow

### 3. Test a Workflow
```bash
curl -X GET "https://your-n8n/webhook/google/reviews?accountId=123&locationId=456" \
  -H "X-N8N-API-Key: your-key" \
  -H "Authorization: Bearer your-token"
```

---

## 🔑 Authentication Quick Reference

| Provider | Auth Header Format |
|----------|-------------------|
| **Toast** | `Authorization: Bearer <token>`<br>`Toast-Restaurant-External-ID: <guid>` |
| **Google** | `Authorization: Bearer <oauth_token>` |
| **Yelp** | `Authorization: Bearer <api_key>` |
| **OpenTable** | `Authorization: Bearer <oauth_token>` |
| **Resy** | `Authorization: ResyAPI api_key="<key>"` |
| **Instagram** | `Authorization: Bearer <facebook_token>` |
| **Facebook** | `Authorization: Bearer <page_token>` |

---

## 🌐 API Endpoints

### Toast POS
```
POST /toast/orders               # Create order
GET  /toast/orders/:orderGuid    # Get order details
GET  /toast/menus                # Get menu items
```

### Google Business Profile
```
GET /google/reviews              # Get reviews
PUT /google/reviews/reply        # Reply to review
```

### Yelp Fusion
```
GET /yelp/reviews                # Get business reviews
```

### OpenTable
```
GET /opentable/reservations      # Get reservations
```

### Resy
```
GET /resy/reservations           # Get reservations
```

### Instagram
```
POST /instagram/posts            # Post content
POST /instagram/comments         # Comment on media
```

### Facebook
```
POST /facebook/posts             # Post to page
POST /facebook/comments          # Comment on post
```

---

## 🧪 Test Commands

### Toast
```bash
curl -X POST https://n8n-instance/webhook/toast/orders \
  -H "X-N8N-API-Key: key" \
  -H "Authorization: Bearer <token>" \
  -H "Toast-Restaurant-External-ID: <guid>" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Google
```bash
curl -X GET "https://n8n-instance/webhook/google/reviews?accountId=123&locationId=456" \
  -H "X-N8N-API-Key: key" \
  -H "Authorization: Bearer <token>"
```

### Yelp
```bash
curl -X GET "https://n8n-instance/webhook/yelp/reviews?businessId=abc" \
  -H "X-N8N-API-Key: key" \
  -H "Authorization: Bearer <api_key>"
```

### OpenTable
```bash
curl -X GET "https://n8n-instance/webhook/opentable/reservations?restaurantId=123" \
  -H "X-N8N-API-Key: key" \
  -H "Authorization: Bearer <token>"
```

### Resy
```bash
curl -X GET "https://n8n-instance/webhook/resy/reservations?venueId=123" \
  -H "X-N8N-API-Key: key" \
  -H 'Authorization: ResyAPI api_key="<key>"'
```

### Instagram
```bash
curl -X POST https://n8n-instance/webhook/instagram/posts \
  -H "X-N8N-API-Key: key" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "instagram-id",
    "imageUrl": "https://...",
    "caption": "Post caption"
  }'
```

### Facebook
```bash
curl -X POST https://n8n-instance/webhook/facebook/posts \
  -H "X-N8N-API-Key: key" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "facebook-page-id",
    "message": "Post message"
  }'
```

---

## ⚙️ Environment Variables

### Required in n8n
```bash
TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com
GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

### Set in Docker
```yaml
environment:
  - TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com
  - GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

### Set in Shell
```bash
export TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com
export GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

---

## 📝 Common Tasks

### Verify All Workflows
```bash
python3 docs/scripts/verify-authentication.py
```

### Check Workflow Status
```bash
# List all workflow files
find . -name "*-workflow.json" -type f

# Count workflows
find . -name "*-workflow.json" | wc -l
```

### Update Documentation
```bash
# Update CHANGELOG
vim CHANGELOG.md

# Update provider README
vim google/README.md

# Verify markdown
# (use your preferred markdown linter)
```

---

## 🔍 Troubleshooting

### 401 Unauthorized
- **Cause:** Invalid or expired token
- **Fix:** Refresh OAuth token or verify API key

### 400 Bad Request
- **Cause:** Missing required parameters
- **Fix:** Check validation requirements in provider README

### 403 Forbidden
- **Cause:** Token valid but lacks permissions
- **Fix:** Verify OAuth scopes or user permissions

### Workflow Not Triggering
- **Check:** Workflow is activated in n8n
- **Check:** Webhook URL is correct
- **Check:** `X-N8N-API-Key` header included

---

## 📚 Documentation Links

| Document | Location | Purpose |
|----------|----------|---------|
| **Main README** | [README.md](../README.md) | Project overview |
| **Architecture** | [docs/reference/ARCHITECTURE.md](./reference/ARCHITECTURE.md) | System design |
| **Authentication** | [docs/reference/AUTHENTICATION-GUIDE.md](./reference/AUTHENTICATION-GUIDE.md) | Auth specs |
| **Migration** | [docs/guides/MIGRATION-GUIDE.md](./guides/MIGRATION-GUIDE.md) | Deployment guide |
| **Testing** | [docs/guides/GOOGLE-TESTING-GUIDE.md](./guides/GOOGLE-TESTING-GUIDE.md) | Test procedures |
| **Changelog** | [CHANGELOG.md](../CHANGELOG.md) | Version history |

---

## 🛠️ Utilities

### Verify Authentication
```bash
cd /path/to/n8n-workflows
python3 docs/scripts/verify-authentication.py
```

### Update Workflow URLs (if needed)
```bash
python3 docs/scripts/update_workflows.py
```

---

## 📊 Status Check

### Workflow Count by Provider
```bash
for dir in toast google yelp opentable resy instagram facebook; do
  count=$(find $dir -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
  echo "$dir: $count workflows"
done
```

### List All Workflows
```bash
find . -name "*-workflow.json" -type f | sort
```

---

## 🔐 Security Checklist

- [ ] No credentials hardcoded in workflows
- [ ] Environment variables set for API hostnames
- [ ] n8n webhook key is strong and random
- [ ] HTTPS used for all communication
- [ ] OAuth tokens refresh automatically
- [ ] API keys rotated periodically
- [ ] Credentials assigned to HTTP Request nodes
- [ ] Validation checks authorization headers

---

## 📞 Quick Help

### Can't find documentation?
→ Check [docs/README.md](./README.md) for complete index

### Need to test a provider?
→ See provider's README in their folder (e.g., `google/README.md`)

### Authentication not working?
→ Run `python3 docs/scripts/verify-authentication.py`

### Want to deploy?
→ Follow [docs/guides/MIGRATION-GUIDE.md](./guides/MIGRATION-GUIDE.md)

### Need provider API docs?
→ Check ARCHITECTURE.md for official documentation links

---

**Last Updated:** 2026-06-08
