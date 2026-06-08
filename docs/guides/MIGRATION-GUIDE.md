# Migration Guide: Supabase to Direct Backend API Calls

## Overview

All n8n workflows have been updated to call backend APIs directly instead of routing through Supabase Edge Functions.

**Previous Architecture**:
```
API Client → n8n Workflow → Supabase Edge Function → Backend API
```

**New Architecture**:
```
API Client → n8n Workflow → Backend API (Toast/Google/OpenTable/etc.)
```

---

## Changes Made

### 1. Toast POS Workflows

**Files Updated:**
- `toast/post-toast-order-workflow.json`
- `toast/get-toast-order-workflow.json`
- `toast/get-toast-menu-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/orders`
- **New URL**: `={{ $env.TOAST_API_HOSTNAME }}/orders/v2/orders`
- **Node Name**: Updated to "Forward to Toast API"

**Required Configuration:**
1. Set environment variable `TOAST_API_HOSTNAME` in n8n
   - Example: `https://ws-api.toasttab.com` (or your Toast-provided hostname)
2. Ensure `Authorization: Bearer <token>` header is passed through
3. Ensure `Toast-Restaurant-External-ID: <guid>` header is passed through

---

### 2. Google Business Profile Workflows

**Files Updated:**
- `google/get-google-reviews-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/google/reviews`
- **New URL**: `={{ $env.GOOGLE_MY_BUSINESS_API_URL + "/v4/accounts/" + $json.query.accountId + "/locations/" + $json.query.locationId + "/reviews" }}`
- **Node Name**: Updated to "Forward to Google API"

**Required Configuration:**
1. Set environment variable `GOOGLE_MY_BUSINESS_API_URL` in n8n
   - Value: `https://mybusiness.googleapis.com`
2. Configure OAuth 2.0 credentials for Google My Business API
3. Ensure proper scopes: `https://www.googleapis.com/auth/business.manage`

---

### 3. Yelp Fusion API Workflows

**Files Updated:**
- `yelp/get-yelp-reviews-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/yelp/reviews`
- **New URL**: `={{ "https://api.yelp.com/v3/businesses/" + $json.query.businessId + "/reviews" }}`
- **Node Name**: Updated to "Forward to Yelp API"

**Required Configuration:**
1. Create Yelp Fusion API key at https://www.yelp.com/developers
2. Configure as Bearer token authentication in n8n
3. Add to HTTP Request node headers: `Authorization: Bearer <YELP_API_KEY>`

---

### 4. OpenTable Platform API Workflows

**Files Updated:**
- `opentable/get-opentable-reservations-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/opentable/reservations`
- **New URL**: `={{ "https://platform.opentable.com/inhouse/v1/booking/" + $json.query.restaurantId + "/reservations" }}`
- **Node Name**: Updated to "Forward to OpenTable API"

**Required Configuration:**
1. Register as OpenTable API partner at https://www.opentable.com/restaurant-solutions/api-partners/
2. Configure OAuth 2.0 client credentials
   - Token URL: `https://oauth.opentable.com/api/v2/oauth/token?grant_type=client_credentials`
   - Auth method: Basic Auth with client_id:client_secret
3. Add Bearer token to requests

---

### 5. Resy API Workflows

**Files Updated:**
- `resy/get-resy-reservations-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/resy/reservations`
- **New URL**: `https://api.resy.com/3/user/reservations`
- **Node Name**: Updated to "Forward to Resy API"

**Required Configuration:**
1. Extract Resy API key from their web client JavaScript bundle
2. Configure custom header authentication:
   - Header name: `Authorization`
   - Header value: `ResyAPI api_key="<YOUR_API_KEY>"`
3. For user-specific actions, also include:
   - `X-Resy-Auth-Token: <user_token>`
   - `X-Resy-Universal-Auth: <user_token>`

**Note**: Resy does not have an official public API. Use conservatively.

---

### 6. Instagram Graph API Workflows

**Files Updated:**
- `instagram/post-instagram-content-workflow.json`
- `instagram/post-instagram-comment-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/instagram/posts`
- **New URL**: `={{ "https://graph.facebook.com/v22.0/" + $json.body.accountId + "/media" }}`
- **Node Name**: Updated to "Forward to Instagram API"

**Required Configuration:**
1. Create Facebook App at https://developers.facebook.com/
2. Add Instagram product to your app
3. Configure Facebook Login with Instagram permissions
4. Required scopes:
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_comments`
5. Get Instagram Business Account ID linked to Facebook Page
6. Use Page access token for API calls

---

### 7. Facebook Graph API Workflows

**Files Updated:**
- `facebook/post-facebook-content-workflow.json`
- `facebook/post-facebook-comment-workflow.json`

**Changes:**
- **Old URL**: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/facebook/posts`
- **New URL**: `={{ "https://graph.facebook.com/v22.0/" + $json.body.pageId + "/feed" }}`
- **Node Name**: Updated to "Forward to Facebook API"

**Required Configuration:**
1. Use same Facebook App as Instagram
2. Required permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
3. Get Page access token
4. Use Page ID for posting to feed

---

## Deployment Steps

### Step 1: Update n8n Environment Variables

Add these environment variables to your n8n instance:

```bash
# Toast POS API
TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com

# Google My Business API
GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

**How to set environment variables in n8n:**
- Docker: Add to `docker-compose.yml` under `environment:`
- npm: Export in shell before starting n8n
- SystemD: Add to service file

### Step 2: Configure API Credentials in n8n

Navigate to **Settings → Credentials** in n8n and create:

1. **Toast POS**:
   - Type: Header Auth or Custom
   - Headers: `Authorization: Bearer <token>`, `Toast-Restaurant-External-ID: <guid>`

2. **Google Business Profile**:
   - Type: OAuth2 API
   - Authorization URL: `https://accounts.google.com/o/oauth2/v2/auth`
   - Access Token URL: `https://oauth2.googleapis.com/token`
   - Scope: `https://www.googleapis.com/auth/business.manage`

3. **Yelp Fusion**:
   - Type: Header Auth
   - Name: `Authorization`
   - Value: `Bearer <YOUR_YELP_API_KEY>`

4. **OpenTable**:
   - Type: OAuth2 API
   - Grant Type: Client Credentials
   - Access Token URL: `https://oauth.opentable.com/api/v2/oauth/token?grant_type=client_credentials`
   - Authentication: Basic Auth

5. **Resy**:
   - Type: Header Auth
   - Name: `Authorization`
   - Value: `ResyAPI api_key="<YOUR_API_KEY>"`

6. **Instagram/Facebook**:
   - Type: OAuth2 API
   - Authorization URL: `https://www.facebook.com/v22.0/dialog/oauth`
   - Access Token URL: `https://graph.facebook.com/v22.0/oauth/access_token`
   - Scopes: As listed above for each platform

### Step 3: Import Updated Workflows

1. Open n8n web interface
2. Go to **Workflows**
3. Click **Import from File**
4. Select each updated workflow JSON file
5. Click **Import**

**Import all workflows from:**
- `toast/` folder (3 workflows)
- `google/` folder (1 workflow)
- `yelp/` folder (1 workflow)
- `opentable/` folder (1 workflow)
- `resy/` folder (1 workflow)
- `instagram/` folder (2 workflows)
- `facebook/` folder (2 workflows)

### Step 4: Assign Credentials

For each imported workflow:

1. Open the workflow
2. Click on the "HTTP Request" node (now named "Forward to [Service] API")
3. In the node settings, assign the appropriate credential
4. Save the workflow

### Step 5: Update Webhook URLs (if changed)

If your n8n instance URL has changed:

1. Note the new webhook URL for each workflow
2. Update your API clients (Postman, Supabase Edge Functions, etc.) with new URLs

### Step 6: Test Each Workflow

Test each workflow using curl or Postman:

**Example - Test Toast Order Workflow:**
```bash
curl -X POST https://your-n8n-instance/webhook/toast/orders \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer your-toast-token" \
  -H "Toast-Restaurant-External-ID: your-restaurant-guid" \
  -H "Content-Type: application/json" \
  -d '{"orderGuid": "test-order-123", "customer": {"name": "Test"}}'
```

**Example - Test Yelp Reviews Workflow:**
```bash
curl -X GET "https://your-n8n-instance/webhook/yelp/reviews?businessId=test-business-id" \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer your-yelp-api-key"
```

### Step 7: Activate Workflows

Once tested successfully:

1. Open each workflow in n8n
2. Click the **Active** toggle in the top right
3. Verify it shows as "Active"

---

## Troubleshooting

### Error: "Cannot read property 'TOAST_API_HOSTNAME' of undefined"

**Cause**: Environment variable not set in n8n  
**Solution**: Add `TOAST_API_HOSTNAME` to your n8n environment and restart n8n

### Error: "401 Unauthorized" from Backend API

**Cause**: Invalid or expired API credentials  
**Solution**: 
1. Check credential configuration in n8n
2. Verify OAuth tokens are not expired
3. Re-authenticate if necessary

### Error: "404 Not Found" from Backend API

**Cause**: Incorrect API endpoint URL or resource ID  
**Solution**:
1. Verify the API endpoint matches the backend documentation
2. Check that path parameters (orderGuid, businessId, etc.) are being passed correctly
3. Review workflow execution logs in n8n

### Error: "429 Too Many Requests"

**Cause**: Rate limit exceeded on backend API  
**Solution**:
1. Implement request throttling in your workflows
2. Add retry logic with exponential backoff
3. Cache responses when possible

### Workflow Doesn't Trigger

**Cause**: Webhook configuration issue  
**Solution**:
1. Verify workflow is activated
2. Check webhook URL is correct
3. Ensure `X-N8N-API-Key` header is included in requests

---

## Rollback Plan

If you need to rollback to the old Supabase architecture:

1. Restore workflow JSON files from git history
2. Redeploy Supabase Edge Functions
3. Update n8n webhooks to forward to Supabase instead of backend APIs

---

## API Rate Limits

Be aware of these rate limits:

| Service | Rate Limit | Notes |
|---------|------------|-------|
| Toast POS | Varies | Production environment is rate limited |
| Google Business Profile | Varies by quota | Check Google Cloud Console |
| Yelp Fusion | 5,000 calls/day | Per API key |
| OpenTable | Contact for limits | Depends on partnership agreement |
| Resy | Unknown | Unofficial API, use conservatively |
| Instagram Graph | Varies by tier | 200 calls/hour default |
| Facebook Graph | Varies by tier | 200 calls/hour default |

---

## Support

For issues with:
- **Toast POS API**: Contact Toast support or check https://doc.toasttab.com/
- **Google Business Profile API**: https://developers.google.com/my-business
- **Yelp Fusion API**: https://docs.developer.yelp.com/
- **OpenTable API**: Contact OpenTable partner support
- **Resy API**: No official support (unofficial API)
- **Instagram/Facebook Graph API**: https://developers.facebook.com/

---

## Version History

- **2026-06-08**: Migrated all workflows from Supabase Edge Functions to direct backend API calls
- **2026-06-08**: Added ARCHITECTURE.md and this MIGRATION-GUIDE.md
- **2026-06-08**: Updated all 11 workflows across 7 integrations
