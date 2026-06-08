# Get OpenTable Reservations Workflow

**Version:** 1.0.0  
**Last Updated:** 2026-06-08  
**Status:** Development  

This n8n workflow retrieves OpenTable restaurant reservations with **mandatory header authentication**, validates required parameters, logs requests, forwards to Supabase backend via **secure HTTPS**, and returns reservation data with date filtering and pagination.

---

## Table of Contents

- [Overview](#overview)
- [Security Features](#security-features)
- [Workflow Structure](#workflow-structure)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [API Reference](#api-reference)
- [OpenTable API](#opentable-api)
- [Troubleshooting](#troubleshooting)

---

## Overview

### Quick Facts

- **Webhook Path:** `/opentable/reservations`
- **Method:** GET
- **Authentication:** Header Auth + Required Headers
- **Nodes:** 7
- **Environment:** Development
- **Reference:** [OpenTable API Documentation](https://platform.opentable.com/documentation/)

### What It Does

1. Receives GET requests to `/opentable/reservations` webhook
2. Validates authentication via header credential
3. Validates presence of `Authorization` header and `restaurantId` query parameter
4. Logs all incoming requests with timestamps
5. Forwards valid requests to Supabase backend
6. Supports date filtering and pagination
7. Returns OpenTable reservation data to caller
8. Returns 400 errors for missing required parameters

### Reservation Data Includes

- Reservation ID and confirmation code
- Guest name, phone, and email
- Party size and table assignment
- Reservation date and time
- Status (confirmed, seated, completed, cancelled, no-show)
- Special requests and notes
- Tags and guest preferences
- Channel source (web, phone, app)

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
│  Webhook Trigger        │ ← GET /opentable/reservations?restaurantId=xxx
│  (Header Auth)          │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Validate Required      │ ← Check Authorization & restaurantId
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
- **Path:** `opentable/reservations`
- **Method:** GET
- **Auth:** Header Auth
- **Credential:** `SUPABASE-EDGE-API-KEY`
- **Response Mode:** `responseNode`

#### 2. Validate Required Headers and Params
- **Type:** `n8n-nodes-base.if` v2.3
- **Conditions:** AND combinator
  - `Authorization` header is not empty
  - `restaurantId` query parameter is not empty
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
- OpenTable API access
- OpenTable restaurant ID

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
2. Select `get-opentable-reservations-workflow.json`
3. Click **Import**

### Step 3: Configure Backend URL

1. Click the **Forward to Backend** node
2. Update the `url` field to your backend endpoint:
   ```
   https://your-backend.com/api/opentable/reservations
   ```
3. Ensure query parameters are properly configured

### Step 4: Activate Workflow

1. Click **Publish** button (top right)
2. Toggle **Active** switch to enable the webhook
3. Note the webhook URL displayed

---

## Testing

### Test Scenarios

#### ✅ Scenario 1: Valid Request (Should Return Reservations)

```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Expected Response:** 200 OK with reservations data

```json
{
  "reservations": [
    {
      "id": "res-12345",
      "confirmationCode": "ABC123",
      "guest": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-123-4567"
      },
      "partySize": 4,
      "reservationDateTime": "2026-06-15T19:30:00Z",
      "status": "confirmed",
      "table": {
        "name": "Table 12",
        "section": "Main Dining"
      },
      "specialRequests": "Window seat preferred",
      "tags": ["vip", "anniversary"],
      "channel": "web",
      "createdAt": "2026-06-01T14:22:00Z"
    }
  ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20
}
```

#### ✅ Scenario 2: Valid Request with Date Range

```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&startDate=2026-06-15&endDate=2026-06-20" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ✅ Scenario 3: Valid Request with Status Filter

```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&status=confirmed" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ✅ Scenario 4: Valid Request with Pagination

```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&pageSize=50&page=2" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ❌ Scenario 5: Missing Authorization Header

```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456" \
  -H 'X-N8N-API-Key: your-secret-key'
```

**Expected Response:** 400 Bad Request
```json
{
  "error": "Missing required parameters",
  "message": "Authorization header and restaurantId query parameter are required"
}
```

#### ❌ Scenario 6: Missing Restaurant ID

```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

**Expected Response:** 400 Bad Request (same as Scenario 5)

---

## API Reference

### Webhook Endpoint

**URL:** `http://localhost:5678/webhook/opentable/reservations`  
**Production:** `https://your-n8n-instance.com/webhook/opentable/reservations`  
**Method:** `GET`

### Required Headers

| Header | Required | Format | Example |
|--------|----------|--------|---------|
| `X-N8N-API-Key` | ✅ Yes | Custom header | `your-secret-key` |
| `Authorization` | ✅ Yes | `Bearer <token>` | `Bearer eyJhbGc...` |

### Required Query Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| `restaurantId` | ✅ Yes | String/Integer | OpenTable restaurant ID | `123456` |

### Optional Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `startDate` | Date | Start date for reservations (ISO 8601) | `2026-06-15` |
| `endDate` | Date | End date for reservations (ISO 8601) | `2026-06-20` |
| `status` | String | Filter by status (confirmed, seated, completed, cancelled, no-show) | `confirmed` |
| `pageSize` | Integer | Number of reservations per page (default: 20, max: 100) | `50` |
| `page` | Integer | Page number (default: 1) | `2` |

---

## OpenTable API

### Getting Your Restaurant ID

1. Log in to [OpenTable for Restaurants](https://restaurant.opentable.com/)
2. Go to Settings → Restaurant Information
3. Your restaurant ID is displayed in the account details
4. Or extract from OpenTable restaurant URL

### API Access

- **Platform:** OpenTable Connect API
- **Authentication:** OAuth 2.0
- **Rate Limits:** Varies by plan
- **Documentation:** https://platform.opentable.com/documentation/

### Reservation Statuses

| Status | Description |
|--------|-------------|
| `confirmed` | Reservation is confirmed |
| `seated` | Guest has been seated |
| `completed` | Reservation completed successfully |
| `cancelled` | Reservation cancelled by guest or restaurant |
| `no-show` | Guest did not arrive |
| `waitlist` | Guest on waitlist |

### Reservation Data Structure

Reservations from OpenTable API include:
- **id**: Unique reservation identifier
- **confirmationCode**: Guest confirmation code
- **guest**: Guest details (name, email, phone)
- **partySize**: Number of guests
- **reservationDateTime**: Date and time of reservation
- **status**: Current reservation status
- **table**: Table assignment (if available)
- **specialRequests**: Guest notes and requests
- **tags**: Classification tags (vip, anniversary, etc.)
- **channel**: Booking source (web, phone, app)

---

## Use Cases

### 1. Daily Reservation Summary
Fetch today's reservations for floor planning:
```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&startDate=$(date +%Y-%m-%d)&endDate=$(date +%Y-%m-%d)"
```

### 2. Upcoming Confirmed Reservations
Get confirmed reservations for the next 7 days:
```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&startDate=$(date +%Y-%m-%d)&endDate=$(date -d '+7 days' +%Y-%m-%d)&status=confirmed"
```

### 3. No-Show Tracking
Analyze no-show patterns:
```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&status=no-show&startDate=2026-06-01&endDate=2026-06-30"
```

### 4. Reservation Sync
Sync reservations to internal CRM:
```bash
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&startDate=$(date +%Y-%m-%d)"
```

---

## Troubleshooting

### Issue: 400 Bad Request - Missing restaurantId

**Cause:** `restaurantId` query parameter is missing

**Solution:**
1. Verify restaurantId is included in the URL query string
2. Check the restaurant ID is correct
3. Ensure proper URL encoding

### Issue: Empty Reservations Response

**Cause:** No reservations for the specified period or wrong restaurant ID

**Solution:**
1. Verify the restaurant ID is correct
2. Check date range includes reservations
3. Verify OpenTable API access permissions

### Issue: Invalid Date Format

**Cause:** Date parameters not in correct format

**Solution:**
Use ISO 8601 date format: `YYYY-MM-DD`
Example: `2026-06-15`

### Issue: Backend Connection Error

**Cause:** Supabase backend is unreachable

**Solution:**
1. Verify backend URL in "Forward to Backend" node
2. Check Supabase backend logs
3. Ensure backend has OpenTable API credentials configured
4. Verify OAuth token is valid

### Issue: Rate Limit Exceeded

**Cause:** Too many API requests

**Solution:**
1. Implement request throttling
2. Use pagination to reduce request frequency
3. Cache results when possible
4. Contact OpenTable to increase rate limits

---

## Integration Notes

### Real-Time Updates
- OpenTable supports webhooks for real-time reservation updates
- Configure webhook notifications in OpenTable dashboard
- Subscribe to events: created, updated, cancelled, no-show

### Guest Management
- Link reservations to guest profiles in your CRM
- Track guest preferences and history
- Implement VIP tagging system

### Table Management
- Sync with floor plan management system
- Optimize table assignments
- Track table utilization

---

## Files

- `get-opentable-reservations-workflow.json` - Workflow configuration
- `README.md` - This file

---

**Environment:** Development  
**Last Tested:** 2026-06-08  
**Status:** ✅ Ready for Testing

**Note:** Ensure your OpenTable API credentials have the necessary permissions to access reservation data.
