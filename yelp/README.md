# Get Yelp Business Reviews Workflow

**Version:** 1.0.0  
**Last Updated:** 2026-06-08  
**Status:** Development  

This n8n workflow retrieves Yelp business reviews with **mandatory header authentication**, validates required parameters, logs requests, forwards to Supabase backend via **secure HTTPS**, and returns review data with pagination support.

---

## Table of Contents

- [Overview](#overview)
- [Security Features](#security-features)
- [Workflow Structure](#workflow-structure)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Yelp Fusion API](#yelp-fusion-api)
- [Troubleshooting](#troubleshooting)

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
5. Forwards valid requests to Supabase backend
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

**Cause:** Supabase backend is unreachable

**Solution:**
1. Verify backend URL in "Forward to Backend" node
2. Check Supabase backend logs
3. Ensure backend has Yelp API credentials configured

---

## Files

- `get-yelp-reviews-workflow.json` - Workflow configuration
- `README.md` - This file

---

**Environment:** Development  
**Last Tested:** 2026-06-08  
**Status:** ✅ Ready for Testing

**Note:** Remember that Yelp Fusion API returns maximum 3 reviews per business with truncated text. Plan your integration accordingly.
