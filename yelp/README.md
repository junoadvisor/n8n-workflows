# Yelp Integration Workflows

**Version:** 1.1.0  
**Last Updated:** 2026-06-08  
**Status:** Development  

This folder contains n8n workflows for Yelp business integration, including retrieving reviews and responding to them via the Yelp Partner API.

## Available Workflows

| Workflow | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Get Reviews** | GET | `/yelp/reviews` | Retrieve Yelp business reviews |
| **Reply to Review** | POST | `/yelp/reviews/reply` | Respond to a Yelp review (Partner API) |

---

# Get Yelp Business Reviews Workflow

**Version:** 1.0.0  
**Status:** Production Ready  

This n8n workflow retrieves Yelp business reviews with **mandatory header authentication**, validates required parameters, logs requests, forwards to Yelp Fusion API via **secure HTTPS**, and returns review data with pagination support.

---

## Table of Contents

- [Get Reviews - Overview](#overview)
- [Get Reviews - Security Features](#security-features)
- [Get Reviews - Workflow Structure](#workflow-structure)
- [Get Reviews - Setup Instructions](#setup-instructions)
- [Get Reviews - Testing](#testing)
- [Get Reviews - API Reference](#api-reference)
- [Get Reviews - Yelp Fusion API](#yelp-fusion-api)
- [Get Reviews - Troubleshooting](#troubleshooting)
- [Reply to Review - Overview](#reply-to-review-overview)
- [Reply to Review - Security Features](#reply-security-features)
- [Reply to Review - Workflow Structure](#reply-workflow-structure)
- [Reply to Review - Setup Instructions](#reply-setup-instructions)
- [Reply to Review - Testing](#reply-testing)
- [Reply to Review - API Reference](#reply-api-reference)
- [Reply to Review - Yelp Partner API](#yelp-partner-api)
- [Reply to Review - Troubleshooting](#reply-troubleshooting)

---

## Overview

### Quick Facts

- **Webhook Path:** `/yelp/reviews`
- **Method:** GET
- **Authentication:** Header Auth + Required Headers
- **Nodes:** 7
- **Environment:** Development
- **Reference:** [Yelp Fusion API](https://docs.developer.yelp.com/reference/v3_business_reviews)

### What It Does

1. Receives GET requests to `/yelp/reviews` webhook
2. Validates authentication via header credential
3. Validates presence of `Authorization` header and `businessId` query parameter
4. Logs all incoming requests with timestamps
5. Forwards valid requests to Yelp Fusion API
6. Supports pagination via `limit` and `offset`
7. Returns Yelp review data to caller
8. Returns 400 errors for missing required parameters

### Review Data Includes

- Review ID and URL
- User name and profile image
- Star rating (1-5)
- Review text
- Time created
- User details (review count, friends)

---

## Security Features

### 🔐 Two-Layer Security

#### Layer 1: Header Authentication
- **Type:** Header Auth credential
- **Credential Name:** `SUPABASE-EDGE-API-KEY`
- **Purpose:** Primary authentication layer
- **Failure Response:** 401 Unauthorized

#### Layer 2: Authorization Header (MANDATORY)
- **Header Name:** `Authorization` (case-insensitive)
- **Format:** `Bearer <token>`
- **Validated:** Before processing
- **Failure Response:** 400 Bad Request

### Security Best Practices

- Never log plain-text API keys or tokens
- All credentials stored in n8n credential manager
- Case-insensitive header validation
- Detailed error messages for debugging
- Audit trail via request logging

---

## Workflow Structure

### Flow Diagram

```
┌─────────────────────────┐
│  Webhook Trigger        │ ← GET /yelp/reviews?businessId=xxx
│  (Header Auth)          │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Validate Required      │ ← Check Authorization & businessId
│  Headers & Params (IF)  │
└──────┬──────────────┬───┘
       ↓              ↓
     TRUE           FALSE
       ↓              ↓
┌──────────────┐  ┌──────────────────────┐
│ Log Request  │  │ Return Error         │
└──────┬───────┘  │ Response (400)       │
       ↓          └──────┬───────────────┘
┌──────────────┐         ↓
│ Forward to   │  ┌──────────────────────┐
│ Backend      │  │ Return Error to      │
│ (GET with    │  │ Webhook              │
│  query)      │  └──────────────────────┘
└──────┬───────┘
       ↓
┌──────────────┐
│ Respond to   │
│ Webhook      │
└──────────────┘
```

### Node Details

#### 1. Webhook Trigger
- **Type:** `n8n-nodes-base.webhook` v2.1
- **Path:** `yelp/reviews`
- **Method:** GET
- **Auth:** Header Auth
- **Credential:** `SUPABASE-EDGE-API-KEY`
- **Response Mode:** `responseNode`

#### 2. Validate Required Headers and Params
- **Type:** `n8n-nodes-base.if` v2.3
- **Conditions:** AND combinator
  - `Authorization` header is not empty
  - `businessId` query parameter is not empty
- **Case-Sensitive:** No

#### 3-7. Additional Nodes
- Error response handling
- Request logging
- Backend forwarding
- Response to webhook

---

## Setup Instructions

### Prerequisites

- n8n instance running (local or cloud)
- Access to n8n credential manager
- `SUPABASE-EDGE-API-KEY` credential configured (Header Auth)
- Yelp Fusion API access
- Yelp business ID

### Step 1: Configure Header Auth Credential

1. Open n8n: http://localhost:5678
2. Go to **Credentials** > **Create New Credential**
3. Select **Header Auth**
4. Configure:
   - **Name:** `SUPABASE-EDGE-API-KEY`
   - **Header Name:** Your custom header (e.g., `X-N8N-API-Key`)
   - **Value:** Generate a strong random key
5. Click **Save**

### Step 2: Import Workflow

1. Go to **Workflows** > **Import from File**
2. Select `get-yelp-reviews-workflow.json`
3. Click **Import**

### Step 3: Configure Backend URL

1. Click the **Forward to Backend** node
2. Update the `url` field to your backend endpoint:
   ```
   https://your-backend.com/api/yelp/reviews
   ```
3. Ensure query parameters are properly configured

### Step 4: Activate Workflow

1. Click **Publish** button (top right)
2. Toggle **Active** switch to enable the webhook
3. Note the webhook URL displayed

---

## Testing

### Test Scenarios

#### ✅ Scenario 1: Valid Request (Should Return Reviews)

```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=WavvLdfdP6g8aZTtbBQHTw" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Expected Response:** 200 OK with reviews data

```json
{
  "reviews": [
    {
      "id": "xAG4O7l-t1ubbwVAlPnDKg",
      "url": "https://www.yelp.com/biz/...",
      "text": "Amazing food and great atmosphere!",
      "rating": 5,
      "time_created": "2026-06-01 10:30:00",
      "user": {
        "id": "user-123",
        "profile_url": "https://www.yelp.com/user_details?userid=...",
        "image_url": "https://s3-media2.fl.yelpcdn.com/photo/...",
        "name": "Jane Smith"
      }
    }
  ],
  "total": 150,
  "possible_languages": ["en"]
}
```

#### ✅ Scenario 2: Valid Request with Pagination

```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=WavvLdfdP6g8aZTtbBQHTw&limit=10&offset=20" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ✅ Scenario 3: Valid Request with Sort

```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=WavvLdfdP6g8aZTtbBQHTw&sort_by=yelp_sort" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ❌ Scenario 4: Missing Authorization Header

```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=WavvLdfdP6g8aZTtbBQHTw" \
  -H 'X-N8N-API-Key: your-secret-key'
```

**Expected Response:** 400 Bad Request
```json
{
  "error": "Missing required parameters",
  "message": "Authorization header and businessId query parameter are required"
}
```

#### ❌ Scenario 5: Missing Business ID

```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

**Expected Response:** 400 Bad Request (same as Scenario 4)

---

## API Reference

### Webhook Endpoint

**URL:** `http://localhost:5678/webhook/yelp/reviews`  
**Production:** `https://your-n8n-instance.com/webhook/yelp/reviews`  
**Method:** `GET`

### Required Headers

| Header | Required | Format | Example |
|--------|----------|--------|---------|
| `X-N8N-API-Key` | ✅ Yes | Custom header | `your-secret-key` |
| `Authorization` | ✅ Yes | `Bearer <token>` | `Bearer eyJhbGc...` |

### Required Query Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| `businessId` | ✅ Yes | String | Yelp business ID | `WavvLdfdP6g8aZTtbBQHTw` |

### Optional Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `limit` | Integer | Number of reviews to return (default: 20, max: 50) | `10` |
| `offset` | Integer | Offset for pagination (default: 0) | `20` |
| `sort_by` | String | Sort order (`yelp_sort`, `rating`, `newest`) | `newest` |

---

## Yelp Fusion API

### Getting Your Business ID

1. Go to [Yelp Fusion API](https://docs.developer.yelp.com/)
2. Use the Business Search or Business Match API to find your business
3. Or extract from Yelp business URL:
   - URL: `https://www.yelp.com/biz/restaurant-name-city-WavvLdfdP6g8aZTtbBQHTw`
   - Business ID: `WavvLdfdP6g8aZTtbBQHTw` (last part)

### API Quotas

- Free tier: 5,000 API calls per day
- Rate limit: Varies by endpoint

### Review Data Structure

Reviews from Yelp Fusion API include:
- **id**: Unique review identifier
- **url**: URL to the review on Yelp
- **text**: Review text (truncated to 160 characters)
- **rating**: 1-5 stars
- **time_created**: Timestamp in format "YYYY-MM-DD HH:MM:SS"
- **user**: Reviewer information
  - id, profile_url, image_url, name

**Note:** Yelp API returns maximum 3 reviews per business

---

## Use Cases

### 1. Review Monitoring
Fetch latest Yelp reviews for reputation management:
```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=xxx&sort_by=newest"
```

### 2. Review Display
Show Yelp reviews on your website:
```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=xxx&limit=3"
```

### 3. Review Aggregation
Collect reviews for analytics (note: Yelp returns max 3):
```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=xxx"
```

### 4. Sentiment Analysis
Get reviews for AI sentiment analysis:
```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=xxx"
```

---

## Important Yelp API Limitations

### Review Limitations
- **Maximum 3 reviews** returned per business
- Reviews are **truncated to 160 characters**
- Cannot access full review history
- Cannot filter by date range

### Workarounds
For more comprehensive review data:
1. Use Yelp web scraping (check Terms of Service)
2. Combine with Google Business Profile reviews
3. Request reviews directly from customers

---

## Troubleshooting

### Issue: 400 Bad Request - Missing businessId

**Cause:** `businessId` query parameter is missing

**Solution:**
1. Verify businessId is included in the URL query string
2. Check the business ID is correct (alphanumeric string)
3. Ensure proper URL encoding

### Issue: Only 3 Reviews Returned

**Cause:** Yelp API limitation

**Solution:**
This is a Yelp API restriction. Maximum 3 reviews per business. For more reviews, consider:
1. Using Google Business Profile API
2. Implementing a web scraping solution (check ToS)
3. Requesting reviews via other channels

### Issue: Empty Reviews Response

**Cause:** No reviews for the business or wrong business ID

**Solution:**
1. Verify the business ID is correct
2. Check if the business has any Yelp reviews
3. Verify Yelp API access token

### Issue: Backend Connection Error

**Cause:** Backend API is unreachable

**Solution:**
1. Verify backend URL in "Forward to Backend" node
2. Check backend API logs
3. Ensure backend has Yelp API credentials configured

---

# Reply to Yelp Business Review Workflow

**Version:** 1.0.0  
**Status:** Production Ready (Requires Yelp Partner Access)  

This n8n workflow responds to Yelp business reviews using the **Yelp Partner API**. It includes authentication, validation, request logging, and direct forwarding to Yelp's partner-api endpoint.

---

## Reply to Review Overview

### Quick Facts

- **Webhook Path:** `/yelp/reviews/reply`
- **Method:** POST
- **Authentication:** Header Auth + Bearer Token
- **Nodes:** 7
- **Environment:** Production (Partner API)
- **Reference:** [Yelp Respond to Reviews API](https://docs.developer.yelp.com/docs/respond-to-reviews-api-v2)

### What It Does

1. Receives POST requests to `/yelp/reviews/reply` webhook
2. Validates authentication via header credential
3. Validates presence of `Authorization` header, `reviewId`, and `response_text` in body
4. Logs all incoming requests with timestamps
5. Forwards valid requests directly to Yelp Partner API
6. Returns Yelp's response to caller
7. Returns 400 errors for missing required parameters

### ⚠️ Important Limitations

- **Partner API Only:** Requires a Yelp partnership contract
- **Rate Limit:** 20 responses per location per day
- **Response Type:** Only `public_comment` is supported (no private responses)
- **Character Support:** UTF-8 only (emojis not supported)
- **Prerequisites:**
  - Business owner must have claimed the location
  - Location must be subscribed to respond-to-reviews feature
  - Business owner must have approved name and photo
  - Active OAuth token required

---

## Reply Security Features

### 🔐 Two-Layer Security

#### Layer 1: Header Authentication
- **Type:** Header Auth credential
- **Credential Name:** `SUPABASE-EDGE-API-KEY`
- **Purpose:** Primary authentication layer
- **Failure Response:** 401 Unauthorized

#### Layer 2: Bearer Token (MANDATORY)
- **Header Name:** `Authorization` (case-insensitive)
- **Format:** `Bearer <yelp_business_owner_token>`
- **Validated:** Before processing
- **Failure Response:** 400 Bad Request
- **Note:** This must be the business owner's OAuth token from Yelp

### Security Best Practices

- Never log plain-text API keys or tokens
- All credentials stored in n8n credential manager
- Case-insensitive header validation
- Detailed error messages for debugging
- Audit trail via request logging

---

## Reply Workflow Structure

### Flow Diagram

```
┌─────────────────────────┐
│  Webhook Trigger        │ ← POST /yelp/reviews/reply
│  (Header Auth)          │   Body: {reviewId, response_text}
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Validate Required      │ ← Check Authorization, reviewId, response_text
│  Headers & Body (IF)    │
└──────┬──────────────┬───┘
       ↓              ↓
     TRUE           FALSE
       ↓              ↓
┌──────────────┐  ┌──────────────────────┐
│ Log Request  │  │ Return Error         │
└──────┬───────┘  │ Response (400)       │
       ↓          └──────┬───────────────┘
┌──────────────┐         ↓
│ Forward to   │  ┌──────────────────────┐
│ Yelp Partner │  │ Return Error to      │
│ API (POST)   │  │ Webhook              │
└──────┬───────┘  └──────────────────────┘
       ↓
┌──────────────┐
│ Respond to   │
│ Webhook      │
└──────────────┘
```

### Node Details

#### 1. Webhook Trigger
- **Type:** `n8n-nodes-base.webhook` v2.1
- **Path:** `yelp/reviews/reply`
- **Method:** POST
- **Auth:** Header Auth
- **Credential:** `SUPABASE-EDGE-API-KEY`
- **Response Mode:** `responseNode`

#### 2. Validate Required Headers and Body
- **Type:** `n8n-nodes-base.if` v2.3
- **Conditions:** AND combinator
  - `Authorization` header is not empty
  - `reviewId` in body is not empty
  - `response_text` in body is not empty
- **Case-Sensitive:** No

#### 3. Log Request
- **Type:** `n8n-nodes-base.set` v3.4
- **Fields Logged:**
  - Timestamp (ISO 8601)
  - Headers
  - Body
  - Review ID

#### 4. Forward to Yelp Partner API
- **Type:** `n8n-nodes-base.httpRequest` v4.2
- **Method:** POST
- **URL:** `https://partner-api.yelp.com/reviews/v1/{reviewId}`
- **Headers:**
  - `Authorization`: Forwarded from request
  - `Content-Type`: `application/json`
- **Body:**
  ```json
  {
    "response_text": "string",
    "response_type": "public_comment"
  }
  ```

---

## Reply Setup Instructions

### Prerequisites

- n8n instance running (local or cloud)
- Access to n8n credential manager
- `SUPABASE-EDGE-API-KEY` credential configured (Header Auth)
- **Yelp Partner Access** (requires contract with Yelp)
- Business owner OAuth token from Yelp
- Location subscribed to respond-to-reviews feature

### Step 1: Configure Header Auth Credential

1. Open n8n: http://localhost:5678
2. Go to **Credentials** > **Create New Credential**
3. Select **Header Auth**
4. Configure:
   - **Name:** `SUPABASE-EDGE-API-KEY`
   - **Header Name:** Your custom header (e.g., `X-N8N-API-Key`)
   - **Value:** Generate a strong random key
5. Click **Save**

### Step 2: Import Workflow

1. Go to **Workflows** > **Import from File**
2. Select `put-yelp-review-reply-workflow.json`
3. Click **Import**

### Step 3: Activate Workflow

1. Click **Publish** button (top right)
2. Toggle **Active** switch to enable the webhook
3. Note the webhook URL displayed (e.g., `http://localhost:5678/webhook/yelp/reviews/reply`)

---

## Reply Testing

### Test Request Example

```bash
# Replace with your n8n webhook URL, API key, and Yelp business owner token
curl -X POST http://localhost:5678/webhook/yelp/reviews/reply \
  -H "X-N8N-API-Key: your-n8n-api-key-here" \
  -H "Authorization: Bearer yelp_business_owner_token" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewId": "xyz123abc456",
    "response_text": "Thank you for your feedback! We appreciate your business and look forward to serving you again."
  }'
```

### Expected Success Response (200)

```json
{
  "review_id": "xyz123abc456",
  "response_id": "resp_abc123",
  "response_text": "Thank you for your feedback! We appreciate your business and look forward to serving you again.",
  "response_type": "public_comment",
  "created_at": "2026-06-08T14:56:00Z",
  "status": "published"
}
```

### Error Response Examples

#### Missing Required Fields (400)

```json
{
  "error": "Missing required parameters",
  "message": "Authorization header, reviewId, and response_text are required"
}
```

#### Unauthorized (401)

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "description": "Please provide valid credentials"
  }
}
```

#### Rate Limit Exceeded (429)

```json
{
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "description": "You are not allowed to comment at this time."
  }
}
```

#### Location Not Authorized (403)

```json
{
  "error": {
    "code": "FEATURE_NOT_ENABLED",
    "description": "This location does not include the respond-to-reviews feature. Contact your official Yelp Partner for more information."
  }
}
```

---

## Reply API Reference

### Request Specification

| Component | Value |
|-----------|-------|
| **Method** | POST |
| **Endpoint** | `/yelp/reviews/reply` |
| **Content-Type** | `application/json` |

### Required Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-N8N-API-Key` | n8n webhook authentication | `your-secret-key` |
| `Authorization` | Yelp business owner Bearer token | `Bearer ya29.xxx` |

### Request Body

```json
{
  "reviewId": "string (required)",
  "response_text": "string (required, UTF-8 only)"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reviewId` | string | ✅ | Yelp review ID to respond to |
| `response_text` | string | ✅ | UTF-8 response text (no emojis) |

### Example Request Body

```json
{
  "reviewId": "xyz123abc456",
  "response_text": "Thank you for your wonderful review! We're thrilled you enjoyed your experience. We look forward to welcoming you back soon!"
}
```

---

## Yelp Partner API

### Official Documentation

- **API Overview:** [Respond to Reviews API](https://docs.developer.yelp.com/docs/respond-to-reviews-api-v2)
- **Partner APIs:** [Yelp Partner APIs](https://docs.developer.yelp.com/docs/yelp-partner-apis)
- **FAQs:** [Partner API FAQs](https://docs.developer.yelp.com/docs/faqs)

### Endpoint Details

**Base URL:** `https://partner-api.yelp.com`

**Endpoint:** `POST /reviews/v1/{review_id}`

**Authentication:** Bearer token (business owner OAuth)

**Rate Limits:**
- 20 responses per location per day
- Rate limit resets at midnight PST

### Response Type

Only `public_comment` is supported. This creates a public response visible on Yelp.

**Note:** Private responses are not available via the API.

### Character Restrictions

- **Supported:** UTF-8 characters
- **Not Supported:** Emojis

### Access Requirements

1. **Partnership Contract:** Must be an official Yelp partner
2. **Location Subscription:** Location must be subscribed via Location Subscription API
3. **Business Owner Claim:** Business owner must have claimed the location
4. **Profile Verification:** Business owner must have approved name and photo
5. **Active Token:** Valid OAuth token required

---

## Reply Troubleshooting

### Issue: 401 Unauthorized

**Cause:** Missing or invalid n8n API key

**Solution:**
1. Verify `X-N8N-API-Key` header is included
2. Check the header name matches your n8n credential
3. Verify the API key value is correct

### Issue: 400 Missing Required Parameters

**Cause:** Missing `Authorization`, `reviewId`, or `response_text`

**Solution:**
1. Verify `Authorization` header is included with Bearer token
2. Check request body includes both `reviewId` and `response_text`
3. Ensure proper JSON formatting

### Issue: 403 Feature Not Enabled

**Cause:** Location not authorized for respond-to-reviews feature

**Solution:**
1. Verify location is subscribed via Location Subscription API
2. Contact your Yelp Partner representative
3. Ensure partnership contract includes this feature

### Issue: 429 Rate Limit Exceeded

**Cause:** Exceeded 20 responses per location per day

**Solution:**
1. Wait until midnight PST for rate limit reset
2. Implement response queuing system
3. Prioritize which reviews to respond to

### Issue: 400 Invalid Response Text

**Cause:** Response text contains unsupported characters (emojis)

**Solution:**
1. Remove emojis from response text
2. Ensure text is UTF-8 encoded
3. Validate character set before sending

### Issue: Review Already Responded

**Cause:** Business owner already responded to this review

**Solution:**
1. Check if review has existing response via Reviews API
2. Consider updating via a different endpoint if available
3. Verify reviewId is correct

### Issue: Invalid OAuth Token

**Cause:** Expired or invalid business owner token

**Solution:**
1. Refresh OAuth token via Yelp authentication flow
2. Verify token belongs to the correct business owner
3. Check token scopes include review response permissions

---

## Files

- `get-yelp-reviews-workflow.json` - Get reviews workflow configuration
- `put-yelp-review-reply-workflow.json` - Reply to review workflow configuration
- `README.md` - This file

---

**Environment:** Production  
**Last Tested:** 2026-06-08  
**Status:** ✅ Ready for Partner Integration

**Important Notes:**
- Yelp Fusion API returns maximum 3 reviews per business
- Respond to Reviews API requires official Yelp partnership
- Rate limited to 20 responses per location per day
- Only public comments supported (no private responses)
- UTF-8 characters only (no emojis)
