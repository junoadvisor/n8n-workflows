# n8n Workflows Architecture

## Architecture Overview

All n8n workflows follow a standard architecture pattern:

```
API Client (Postman/Supabase Edge/etc.) 
    ↓
n8n Workflow (Validation & Routing) 
    ↓
Backend API (Toast/Google/OpenTable/Resy/Yelp/Instagram/Facebook)
```

### Key Principles

1. **No Direct Supabase Connection**: Workflows do NOT forward requests to Supabase Edge Functions
2. **Direct API Calls**: n8n calls the actual third-party backend APIs directly
3. **Standard HTTP Pattern**: Request validation → API call → Response forwarding

---

## Backend API Endpoints

### 1. Toast POS API

**Base URL**: `https://[toast-api-hostname]` (environment-specific)

- **Authentication**: 
  - `Authorization: Bearer <token>`
  - `Toast-Restaurant-External-ID: <restaurant-guid>`
- **Endpoints**:
  - POST `/orders` - Create order
  - GET `/orders/{orderGuid}` - Get order details
  - GET `/menus` - Get menu items

**Note**: Toast provides environment-specific hostnames. You must configure this in n8n credentials or environment variables.

**Documentation**: https://doc.toasttab.com/

---

### 2. Google Business Profile API

**Base URLs**:
- Business Info: `https://mybusinessbusinessinformation.googleapis.com/v1`
- Reviews (Legacy): `https://mybusiness.googleapis.com/v4`

- **Authentication**: 
  - `Authorization: Bearer <OAuth-token>`
  - Requires OAuth 2.0 with scope: `https://www.googleapis.com/auth/business.manage`
- **Endpoints**:
  - GET `/accounts/{accountId}/locations/{locationId}/reviews` - Get reviews

**Documentation**: https://developers.google.com/my-business

---

### 3. Yelp Fusion API

**Base URL**: `https://api.yelp.com/v3`

- **Authentication**: 
  - `Authorization: Bearer <API-KEY>`
- **Endpoints**:
  - GET `/businesses/{businessId}/reviews` - Get business reviews
  - GET `/businesses/search` - Search businesses

**Documentation**: https://docs.developer.yelp.com/

---

### 4. OpenTable API

**Base URLs**:
- OAuth: `https://oauth.opentable.com`
- Platform: `https://platform.opentable.com`

- **Authentication**: 
  - OAuth 2.0 client credentials flow
  - `Authorization: Bearer <access-token>`
- **Endpoints**:
  - GET `/inhouse/v1/booking/{rid}/reservations` - Get reservations

**Documentation**: https://docs.opentable.com/

---

### 5. Resy API

**Base URL**: `https://api.resy.com`

- **Authentication**: 
  - `Authorization: ResyAPI api_key="<API-KEY>"`
  - User actions require: `X-Resy-Auth-Token` and `X-Resy-Universal-Auth`
- **Endpoints**:
  - GET `/3/user/reservations` - Get user reservations
  - GET `/4/find?venue_id={id}&day={date}&party_size={N}` - Find availability
  - GET `/3/venue?url_slug={slug}&location={city}` - Get venue details

**Note**: Resy does not have an official public API. These are reverse-engineered endpoints.

---

### 6. Instagram Graph API

**Base URL**: `https://graph.facebook.com/v22.0`

- **Authentication**: 
  - `Authorization: Bearer <access-token>`
  - Requires Facebook OAuth 2.0
- **Endpoints**:
  - POST `/{ig-user-id}/media` - Create media container
  - POST `/{ig-user-id}/media_publish` - Publish media
  - POST `/{ig-media-id}/comments` - Add comment

**Documentation**: https://developers.facebook.com/docs/instagram-platform

---

### 7. Facebook Graph API

**Base URL**: `https://graph.facebook.com/v22.0`

- **Authentication**: 
  - `Authorization: Bearer <access-token>`
  - Requires Facebook OAuth 2.0
- **Endpoints**:
  - POST `/{page-id}/feed` - Create post
  - POST `/{object-id}/comments` - Add comment

**Documentation**: https://developers.facebook.com/docs/graph-api

---

## n8n Workflow Structure

Each workflow follows this node structure:

### 1. Webhook Trigger
- Receives incoming HTTP request
- Uses Header Auth credential for n8n webhook security

### 2. Validation IF Node
- Validates required headers (Authorization, etc.)
- Validates required parameters (path params, query params, body)

### 3. Error Response Node
- Returns 400 Bad Request for missing required parameters
- Returns structured JSON error response

### 4. Request Logging Node
- Logs timestamp, headers, and request data
- For audit and debugging purposes

### 5. HTTP Request Node
- Calls the actual backend API (Toast, Google, OpenTable, etc.)
- Forwards necessary headers and parameters
- Uses appropriate authentication method

### 6. Response Webhook Node
- Returns API response to the original caller
- Preserves response status codes and headers

---

## Security Layers

### Layer 1: n8n Webhook Security
- Header Authentication on webhook trigger
- Shared credential: `SUPABASE-EDGE-API-KEY` (or rename to generic key)

### Layer 2: Request Validation
- Validates `Authorization` header (Bearer token)
- Validates service-specific headers (e.g., `Toast-Restaurant-External-ID`)
- Validates required parameters

### Layer 3: Backend API Authentication
- Each backend API has its own authentication
- OAuth tokens, API keys, or service-specific auth
- Configured as n8n credentials

---

## Deployment Considerations

### Environment Variables Needed

1. **Toast**:
   - `TOAST_API_HOSTNAME` - Environment-specific hostname
   
2. **Google**:
   - OAuth 2.0 credentials configured in n8n
   
3. **Yelp**:
   - `YELP_API_KEY` - Fusion API key
   
4. **OpenTable**:
   - `OPENTABLE_CLIENT_ID` and `OPENTABLE_CLIENT_SECRET`
   
5. **Resy**:
   - `RESY_API_KEY` - Public client API key
   
6. **Instagram**:
   - Facebook OAuth 2.0 credentials
   
7. **Facebook**:
   - Facebook OAuth 2.0 credentials

### Rate Limiting

Each backend API has its own rate limits:
- **Toast**: Production environment is rate limited
- **Yelp**: 5,000 calls/day per API key
- **Google**: Varies by API and quota
- **OpenTable**: Contact for limits
- **Resy**: Unofficial API, use conservatively
- **Instagram/Facebook**: Varies by app tier

---

## Migration from Supabase Architecture

### Old Architecture (Incorrect)
```
API Client → n8n → Supabase Edge Function → Backend API
```

### New Architecture (Correct)
```
API Client → n8n → Backend API
```

### Changes Required

1. Update HTTP Request node URL in each workflow
2. Configure backend API credentials in n8n
3. Update authentication headers to match backend API requirements
4. Test each workflow with actual backend API credentials

---

## Testing

### Test Each Workflow

1. Import workflow into n8n
2. Configure backend API credentials
3. Activate workflow
4. Send test request via curl/Postman
5. Verify response from backend API
6. Check workflow execution logs

### Example Test Command

```bash
# Test Toast Order workflow
curl -X POST https://your-n8n-instance/webhook/toast/orders \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer your-toast-token" \
  -H "Toast-Restaurant-External-ID: your-restaurant-guid" \
  -H "Content-Type: application/json" \
  -d @order-payload.json
```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized**:
   - Check backend API credentials
   - Verify OAuth token is valid and not expired
   - Ensure correct authentication header format

2. **404 Not Found**:
   - Verify backend API endpoint URL
   - Check API version in URL path
   - Ensure resource ID parameters are correct

3. **429 Rate Limit**:
   - Backend API rate limit exceeded
   - Implement request throttling
   - Consider caching responses

4. **500 Internal Server Error**:
   - Check backend API status
   - Review workflow execution logs
   - Verify request payload format

---

## Version History

- **2026-06-08**: Architecture redesigned to call backend APIs directly
- **2026-06-08**: Removed Supabase Edge Function intermediary
- **2026-06-08**: Updated all workflows to new architecture
