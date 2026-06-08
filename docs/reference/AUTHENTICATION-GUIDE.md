# Authentication Configuration Guide

This document specifies the exact authentication requirements for each backend API provider.

---

## Overview

All workflows follow this authentication pattern:
1. **n8n Webhook Auth**: First layer (Header Auth with `X-N8N-API-Key`)
2. **Backend API Auth**: Second layer (provider-specific, forwarded in HTTP Request node)

---

## Provider Authentication Details

### 1. Toast POS API

**Authentication Type:** Bearer Token + Custom Header

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      },
      {
        "name": "Toast-Restaurant-External-ID",
        "value": "={{ $json.headers['toast-restaurant-external-id'] ?? $json.headers['Toast-Restaurant-External-ID'] }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X POST https://n8n-instance/webhook/toast/orders \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <TOAST_API_TOKEN>" \
  -H "Toast-Restaurant-External-ID: <RESTAURANT_GUID>" \
  -H "Content-Type: application/json" \
  -d '{"orderData": "..."}'
```

**Backend API Receives:**
- `Authorization: Bearer <TOAST_API_TOKEN>`
- `Toast-Restaurant-External-ID: <RESTAURANT_GUID>`

**Documentation:** https://doc.toasttab.com/doc/devguide/authentication.html

---

### 2. Google Business Profile API

**Authentication Type:** OAuth 2.0 Bearer Token

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X GET "https://n8n-instance/webhook/google/reviews?accountId=123&locationId=456" \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <GOOGLE_OAUTH_TOKEN>"
```

**Backend API Receives:**
- `Authorization: Bearer <GOOGLE_OAUTH_TOKEN>`

**OAuth Scope Required:**
- `https://www.googleapis.com/auth/business.manage`

**Documentation:** https://developers.google.com/my-business

---

### 3. Yelp Fusion API

**Authentication Type:** Bearer Token (API Key)

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X GET "https://n8n-instance/webhook/yelp/reviews?businessId=abc123" \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <YELP_API_KEY>"
```

**Backend API Receives:**
- `Authorization: Bearer <YELP_API_KEY>`

**Get API Key:** https://www.yelp.com/developers/v3/manage_app

**Documentation:** https://docs.developer.yelp.com/docs/fusion-authentication

---

### 4. OpenTable Platform API

**Authentication Type:** OAuth 2.0 Bearer Token (Client Credentials)

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X GET "https://n8n-instance/webhook/opentable/reservations?restaurantId=123" \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <OPENTABLE_ACCESS_TOKEN>"
```

**Backend API Receives:**
- `Authorization: Bearer <OPENTABLE_ACCESS_TOKEN>`

**OAuth Token Endpoint:**
```
POST https://oauth.opentable.com/api/v2/oauth/token?grant_type=client_credentials
Authorization: Basic <base64(client_id:client_secret)>
```

**Documentation:** https://docs.opentable.com/

---

### 5. Resy API

**Authentication Type:** Custom Header (ResyAPI)

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      },
      {
        "name": "User-Agent",
        "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
      },
      {
        "name": "Origin",
        "value": "https://resy.com"
      },
      {
        "name": "Referer",
        "value": "https://resy.com/"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X GET "https://n8n-instance/webhook/resy/reservations?venueId=123" \
  -H "X-N8N-API-Key: webhook-key" \
  -H 'Authorization: ResyAPI api_key="<RESY_API_KEY>"'
```

**Backend API Receives:**
- `Authorization: ResyAPI api_key="<RESY_API_KEY>"`
- `User-Agent: Mozilla/5.0...`
- `Origin: https://resy.com`
- `Referer: https://resy.com/`

**⚠️ Important Notes:**
- Resy does NOT use standard Bearer token format
- Format is: `ResyAPI api_key="YOUR_KEY_HERE"`
- API key is extracted from Resy's web client JavaScript bundle
- Additional headers (User-Agent, Origin, Referer) prevent 302 redirects
- This is an unofficial/undocumented API - use cautiously

**For User-Specific Actions (bookings, waitlist):**
Also include:
```
X-Resy-Auth-Token: <USER_TOKEN>
X-Resy-Universal-Auth: <USER_TOKEN>
```

---

### 6. Instagram Graph API

**Authentication Type:** OAuth 2.0 Bearer Token (Facebook OAuth)

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X POST https://n8n-instance/webhook/instagram/posts \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <FACEBOOK_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "instagram-business-account-id",
    "imageUrl": "https://...",
    "caption": "Post caption"
  }'
```

**Backend API Receives:**
- `Authorization: Bearer <FACEBOOK_ACCESS_TOKEN>`

**OAuth Scopes Required:**
- `instagram_basic`
- `instagram_content_publish`
- `instagram_manage_comments`

**Documentation:** https://developers.facebook.com/docs/instagram-platform

---

### 7. Facebook Graph API

**Authentication Type:** OAuth 2.0 Bearer Token

**HTTP Request Node Configuration:**
```json
{
  "authentication": "none",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

**Example Client Request:**
```bash
curl -X POST https://n8n-instance/webhook/facebook/posts \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <FACEBOOK_PAGE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "facebook-page-id",
    "message": "Post message"
  }'
```

**Backend API Receives:**
- `Authorization: Bearer <FACEBOOK_PAGE_TOKEN>`

**OAuth Scopes Required:**
- `pages_manage_posts`
- `pages_read_engagement`

**Documentation:** https://developers.facebook.com/docs/graph-api

---

## Authentication Flow

### Standard Flow (Most Providers)

```
Client Request
    ↓
    Headers: 
    - X-N8N-API-Key: <webhook_key>
    - Authorization: Bearer <api_token>
    ↓
n8n Webhook Trigger (validates X-N8N-API-Key)
    ↓
Validation Node (checks Authorization header exists)
    ↓
HTTP Request Node (forwards Authorization to backend)
    ↓
Backend API (validates Bearer token)
    ↓
Response back to client
```

### Special Cases

#### Toast (Multiple Headers)
```
Headers Required:
- Authorization: Bearer <token>
- Toast-Restaurant-External-ID: <guid>

Both forwarded to backend API
```

#### Resy (Custom Format)
```
Header Required:
- Authorization: ResyAPI api_key="<key>"

Plus additional headers:
- User-Agent: <browser_ua>
- Origin: https://resy.com
- Referer: https://resy.com/
```

---

## Token Management

### Token Types

| Provider | Token Type | Expiration | Refresh |
|----------|------------|------------|---------|
| Toast | Static API Token | No expiry | Manual rotation |
| Google | OAuth Access Token | 1 hour | Refresh token |
| Yelp | Static API Key | No expiry | Manual rotation |
| OpenTable | OAuth Access Token | Varies | Client credentials flow |
| Resy | Static API Key | Varies | Extract from web app |
| Instagram | OAuth Access Token | 60 days | Refresh token |
| Facebook | OAuth Access Token | 60 days | Refresh token |

### Handling Token Expiration

**For OAuth Providers (Google, OpenTable, Instagram, Facebook):**

1. **Store Refresh Token**: When user authorizes, store refresh token securely
2. **Monitor 401 Responses**: Detect when access token expires
3. **Refresh Flow**:
   ```bash
   POST https://oauth-provider/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=refresh_token&
   refresh_token=<REFRESH_TOKEN>&
   client_id=<CLIENT_ID>&
   client_secret=<CLIENT_SECRET>
   ```
4. **Update Token**: Replace expired token with new one

**For Static Keys (Toast, Yelp, Resy):**
- Keys don't expire automatically
- Rotate periodically for security
- Update in client application when rotated

---

## Security Best Practices

### 1. Never Hardcode Credentials
❌ Bad:
```json
{
  "name": "Authorization",
  "value": "Bearer ya29.abc123..."
}
```

✅ Good:
```json
{
  "name": "Authorization",
  "value": "={{ $json.headers.authorization }}"
}
```

### 2. Use Environment Variables for Static Values
```bash
# In n8n environment
TOAST_API_HOSTNAME=https://ws-api.toasttab.com
GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

### 3. Validate Auth Headers in Workflows
Every workflow should check:
```json
{
  "conditions": [
    {
      "leftValue": "={{ $json.headers.authorization }}",
      "operator": "isNotEmpty"
    }
  ]
}
```

### 4. Use HTTPS for All Communication
- n8n instance must use HTTPS
- Backend APIs all use HTTPS
- No plain HTTP for production

### 5. Rotate Webhook Keys Regularly
- Change `X-N8N-API-Key` periodically
- Use strong random keys (32+ characters)
- Different key per environment (dev/test/prod)

---

## Testing Authentication

### Test Each Provider

**1. Toast:**
```bash
# Get authentication token
curl -X POST https://your-toast-hostname/authentication/v1/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"clientId": "...", "clientSecret": "...", "userAccessType": "TOAST_MACHINE_CLIENT"}'

# Test with n8n workflow
curl -X POST https://n8n-instance/webhook/toast/orders \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <TOKEN_FROM_ABOVE>" \
  -H "Toast-Restaurant-External-ID: <GUID>" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**2. Google:**
```bash
# Get OAuth token (use OAuth Playground: https://developers.google.com/oauthplayground/)

# Test with n8n workflow
curl -X GET "https://n8n-instance/webhook/google/reviews?accountId=123&locationId=456" \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <OAUTH_TOKEN>"
```

**3. Yelp:**
```bash
# Get API key from: https://www.yelp.com/developers/v3/manage_app

# Test with n8n workflow
curl -X GET "https://n8n-instance/webhook/yelp/reviews?businessId=abc" \
  -H "X-N8N-API-Key: webhook-key" \
  -H "Authorization: Bearer <YELP_API_KEY>"
```

---

## Troubleshooting

### 401 Unauthorized

**Symptom:** Backend API returns 401

**Possible Causes:**
1. Token expired (OAuth providers)
2. Invalid API key
3. Token not included in request
4. Wrong token format (especially Resy)

**Solutions:**
- Verify token is being passed through
- Check token hasn't expired
- Refresh OAuth token
- Verify token format matches provider requirements

### 403 Forbidden

**Symptom:** Backend API returns 403

**Possible Causes:**
1. Token valid but lacks required permissions
2. Resource not accessible to authenticated user
3. OAuth scope missing

**Solutions:**
- Check OAuth scopes include required permissions
- Verify user is owner/manager of resource
- Review provider's permission documentation

### Authentication Header Not Forwarded

**Symptom:** Backend receives request without auth

**Diagnosis:**
```bash
# Check n8n workflow execution logs
# Look for HTTP Request node output
# Verify headerParameters configuration
```

**Solution:**
Ensure HTTP Request node has:
```json
{
  "sendHeaders": true,
  "specifyHeaders": "keypair",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"
      }
    ]
  }
}
```

---

## Verification Checklist

For each workflow, verify:

- [ ] HTTP Request node has `"authentication": "none"` (we manage auth manually)
- [ ] `"sendHeaders": true` is set
- [ ] `"specifyHeaders": "keypair"` is configured
- [ ] Authorization header is forwarded: `"value": "={{ $json.headers.authorization ?? $json.headers.Authorization }}"`
- [ ] Provider-specific headers included (Toast-Restaurant-External-ID for Toast, etc.)
- [ ] Validation node checks Authorization header exists
- [ ] Client request examples in documentation show correct auth format
- [ ] Testing guide includes auth token acquisition steps

---

## Reference

### Quick Authentication Summary

| Provider | Format | Example |
|----------|--------|---------|
| **Toast** | Bearer + Custom | `Authorization: Bearer <token>`<br>`Toast-Restaurant-External-ID: <guid>` |
| **Google** | Bearer | `Authorization: Bearer <oauth_token>` |
| **Yelp** | Bearer | `Authorization: Bearer <api_key>` |
| **OpenTable** | Bearer | `Authorization: Bearer <oauth_token>` |
| **Resy** | Custom | `Authorization: ResyAPI api_key="<key>"` |
| **Instagram** | Bearer | `Authorization: Bearer <facebook_token>` |
| **Facebook** | Bearer | `Authorization: Bearer <page_token>` |

---

**Last Updated:** 2026-06-08  
**Version:** 1.0
