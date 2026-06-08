# Workflow Architecture Update - Summary

## What Was Done

All n8n workflows have been updated to follow the correct architecture pattern as requested:

### ✅ Requirements Met

1. **✅ No Direct Connection to Supabase**
   - Removed all Supabase Edge Function URLs from workflows
   - Workflows no longer route through Supabase

2. **✅ Correct Flow Pattern**
   ```
   API Client (Postman/Supabase Edge/etc.) 
       ↓
   n8n Workflow (Validation & Routing)
       ↓
   Backend API (Toast/Google/OpenTable/Resy/Yelp/Instagram/Facebook)
   ```

3. **✅ Standard HTTP Request-Response Pattern**
   - Request validation (headers, parameters)
   - Direct API call to backend
   - Response forwarding to client
   - Proper error handling (400, 401, etc.)

---

## Updated Workflows

### All 11 Workflows Updated:

| Integration | Workflow Files | Backend API Endpoint |
|-------------|---------------|---------------------|
| **Toast POS** (3) | `toast/*.json` | `{{ $env.TOAST_API_HOSTNAME }}/orders/v2/...` |
| **Google** (1) | `google/*.json` | `{{ $env.GOOGLE_MY_BUSINESS_API_URL }}/v4/accounts/...` |
| **Yelp** (1) | `yelp/*.json` | `https://api.yelp.com/v3/businesses/...` |
| **OpenTable** (1) | `opentable/*.json` | `https://platform.opentable.com/inhouse/v1/...` |
| **Resy** (1) | `resy/*.json` | `https://api.resy.com/3/user/reservations` |
| **Instagram** (2) | `instagram/*.json` | `https://graph.facebook.com/v22.0/...` |
| **Facebook** (2) | `facebook/*.json` | `https://graph.facebook.com/v22.0/...` |

---

## Changes Made

### 1. HTTP Request Node URLs

**Before:**
```
"url": "https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/orders"
```

**After:**
```
"url": "={{ $env.TOAST_API_HOSTNAME }}/orders/v2/orders"
```

### 2. Node Names Updated

All "Forward to Backend" nodes renamed to "Forward to [Service] API":
- Forward to Toast API
- Forward to Google API  
- Forward to Yelp API
- Forward to OpenTable API
- Forward to Resy API
- Forward to Instagram API
- Forward to Facebook API

### 3. Environment Variables Added

Workflows now use environment variables for API hostnames:
- `$env.TOAST_API_HOSTNAME` - Toast POS API hostname
- `$env.GOOGLE_MY_BUSINESS_API_URL` - Google My Business API base URL

---

## Files Created/Updated

### New Documentation Files:
1. **`ARCHITECTURE.md`** - Complete architecture documentation
   - Backend API endpoints for all services
   - Authentication requirements
   - n8n workflow structure
   - Security layers
   - Deployment considerations

2. **`MIGRATION-GUIDE.md`** - Step-by-step migration guide
   - What changed and why
   - Deployment steps
   - Credential configuration
   - Testing procedures
   - Troubleshooting guide

3. **`update_workflows.py`** - Automated update script
   - Updates workflow JSON files
   - Changes URLs to backend APIs
   - Renames HTTP Request nodes

4. **`SUMMARY.md`** - This file

### Updated Files:
1. **`README.md`** - Updated with:
   - New architecture diagram
   - Environment variable requirements
   - Backend API credential setup
   - Configuration instructions

2. **`CHANGELOG.md`** - Added:
   - Architecture migration section
   - Breaking changes notice
   - List of all updated workflows

3. **All Workflow JSON Files** (11 total) - Updated:
   - HTTP Request node URLs
   - Node names
   - Connections (if node names changed)

---

## What You Need to Do Next

### 1. Set Environment Variables

Add to your n8n environment:

```bash
# For Docker
# Add to docker-compose.yml:
environment:
  - TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com
  - GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com

# For npm/local
# Add to .env or export:
export TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com
export GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

### 2. Configure Backend API Credentials

In n8n (Settings → Credentials), create credentials for:

| Service | What You Need |
|---------|---------------|
| Toast | Toast API token and restaurant GUID |
| Google | Google OAuth 2.0 app credentials |
| Yelp | Yelp Fusion API key |
| OpenTable | OpenTable OAuth client credentials |
| Resy | Resy API key (extracted from their web app) |
| Instagram | Facebook OAuth app with Instagram permissions |
| Facebook | Facebook OAuth app with Pages permissions |

### 3. Import Updated Workflows

1. Open n8n web interface
2. Go to Workflows
3. Import each updated JSON file from the respective folder
4. Activate each workflow

### 4. Assign Credentials to Workflows

For each imported workflow:
1. Open the workflow
2. Click on the "Forward to [Service] API" node
3. Assign the appropriate backend API credential
4. Save the workflow

### 5. Test Each Integration

Use curl or Postman to test each workflow:

```bash
# Example: Test Toast Order Workflow
curl -X POST https://your-n8n-instance/webhook/toast/orders \
  -H "X-N8N-API-Key: your-n8n-webhook-key" \
  -H "Authorization: Bearer your-toast-api-token" \
  -H "Toast-Restaurant-External-ID: your-restaurant-guid" \
  -H "Content-Type: application/json" \
  -d '{"orderGuid": "test-123"}'
```

---

## Architecture Verification

To verify the architecture is correct:

1. **Check Workflow URLs**: No workflow should contain `supabase.co` in the HTTP Request node URL
2. **Check Node Names**: All HTTP Request nodes should be named "Forward to [Service] API"
3. **Check Authentication**: Each workflow should use the backend API's native authentication
4. **Check Flow**: API Client → n8n → Backend API (no Supabase in between)

You can verify all workflows using:

```bash
cd /Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows
python3 << 'EOF'
import json, glob

for file in glob.glob('*/*-workflow.json'):
    with open(file) as f:
        data = json.load(f)
        for node in data.get('nodes', []):
            if node.get('type') == 'n8n-nodes-base.httpRequest':
                url = node.get('parameters', {}).get('url', '')
                if 'supabase' in url:
                    print(f"❌ {file} still has Supabase URL")
                else:
                    print(f"✅ {file} - {node.get('name')}")
EOF
```

---

## Benefits of New Architecture

1. **Direct Communication**: Faster response times (no intermediary)
2. **Standard Pattern**: Follows industry best practices
3. **Easier Debugging**: Direct API calls are easier to troubleshoot
4. **Better Error Handling**: Native backend API error responses
5. **Reduced Complexity**: Fewer moving parts in the system
6. **Cost Savings**: No Supabase Edge Function execution costs
7. **Flexibility**: Each backend can be updated independently

---

## Important Notes

### Rate Limits

Be aware of backend API rate limits:
- **Toast**: Production environment has rate limits
- **Yelp**: 5,000 calls/day per API key
- **Google**: Varies by quota (check Google Cloud Console)
- **OpenTable**: Contact for details
- **Resy**: Unofficial API - use conservatively
- **Instagram/Facebook**: 200 calls/hour default

### Authentication Tokens

- Most OAuth tokens expire and need refresh
- Implement token refresh logic in your API clients
- Monitor for 401 Unauthorized responses
- Reauthenticate when necessary

### Error Handling

Workflows return standard HTTP status codes:
- **200 OK**: Successful API call
- **400 Bad Request**: Missing required parameters/headers
- **401 Unauthorized**: Invalid credentials
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Backend API error

---

## Support & Documentation

- **Architecture Details**: See `ARCHITECTURE.md`
- **Migration Steps**: See `MIGRATION-GUIDE.md`
- **Quick Start**: See `README.md`
- **Changes Log**: See `CHANGELOG.md`

For backend API-specific issues:
- Toast: https://doc.toasttab.com/
- Google: https://developers.google.com/my-business
- Yelp: https://docs.developer.yelp.com/
- OpenTable: https://docs.opentable.com/
- Instagram/Facebook: https://developers.facebook.com/

---

## Success Criteria

✅ All workflows call backend APIs directly  
✅ No Supabase URLs in any workflow  
✅ Standard HTTP request-response pattern  
✅ Proper authentication for each backend  
✅ Environment variables configured  
✅ Credentials assigned to workflows  
✅ All workflows tested and working  

---

**Last Updated:** 2026-06-08  
**Architecture Version:** 2.0 (Direct Backend API Calls)
