# Get Resy Reservations Workflow

**Version:** 1.0.0  
**Last Updated:** 2026-06-08  
**Status:** Development  

This n8n workflow retrieves Resy restaurant reservations with **mandatory header authentication**, validates required parameters, logs requests, forwards to Supabase backend via **secure HTTPS**, and returns reservation data with date filtering and pagination.

---

## Table of Contents

- [Overview](#overview)
- [Security Features](#security-features)
- [Workflow Structure](#workflow-structure)
- [Setup Instructions](#setup-instructions)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Resy API](#resy-api)
- [Troubleshooting](#troubleshooting)

---

## Overview

### Quick Facts

- **Webhook Path:** `/resy/reservations`
- **Method:** GET
- **Authentication:** Header Auth + Required Headers
- **Nodes:** 7
- **Environment:** Development
- **Reference:** [Resy Platform API](https://api.resy.com/docs/)

### What It Does

1. Receives GET requests to `/resy/reservations` webhook
2. Validates authentication via header credential
3. Validates presence of `Authorization` header and `venueId` query parameter
4. Logs all incoming requests with timestamps
5. Forwards valid requests to Supabase backend
6. Supports date filtering and pagination
7. Returns Resy reservation data to caller
8. Returns 400 errors for missing required parameters

### Reservation Data Includes

- Reservation ID and token
- Guest name, phone, and email
- Party size and table type
- Reservation date and time
- Status (booked, seated, completed, cancelled, no-show)
- Special notes and requests
- Payment information
- Waitlist status
- Channel source (app, web, phone)

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
│  Webhook Trigger        │ ← GET /resy/reservations?venueId=xxx
│  (Header Auth)          │
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Validate Required      │ ← Check Authorization & venueId
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
- **Path:** `resy/reservations`
- **Method:** GET
- **Auth:** Header Auth
- **Credential:** `SUPABASE-EDGE-API-KEY`
- **Response Mode:** `responseNode`

#### 2. Validate Required Headers and Params
- **Type:** `n8n-nodes-base.if` v2.3
- **Conditions:** AND combinator
  - `Authorization` header is not empty
  - `venueId` query parameter is not empty
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
- Resy API access
- Resy venue ID

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
2. Select `get-resy-reservations-workflow.json`
3. Click **Import**

### Step 3: Configure Backend URL

1. Click the **Forward to Backend** node
2. Update the `url` field to your backend endpoint:
   ```
   https://your-backend.com/api/resy/reservations
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
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Expected Response:** 200 OK with reservations data

```json
{
  "reservations": [
    {
      "id": "resy-67890",
      "token": "RES-ABC123XYZ",
      "guest": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "phone": "+1-555-987-6543"
      },
      "partySize": 2,
      "date": "2026-06-15",
      "time": "19:30:00",
      "status": "booked",
      "tableType": "Standard",
      "notes": "Celebrating anniversary",
      "payment": {
        "type": "credit_card",
        "last4": "4242"
      },
      "channel": "app",
      "createdAt": "2026-06-01T10:15:00Z",
      "updatedAt": "2026-06-01T10:15:00Z"
    }
  ],
  "total": 85,
  "limit": 20,
  "offset": 0
}
```

#### ✅ Scenario 2: Valid Request with Date Range

```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&startDate=2026-06-15&endDate=2026-06-20" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ✅ Scenario 3: Valid Request with Status Filter

```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&status=booked" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ✅ Scenario 4: Valid Request with Pagination

```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&limit=50&offset=50" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

#### ❌ Scenario 5: Missing Authorization Header

```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345" \
  -H 'X-N8N-API-Key: your-secret-key'
```

**Expected Response:** 400 Bad Request
```json
{
  "error": "Missing required parameters",
  "message": "Authorization header and venueId query parameter are required"
}
```

#### ❌ Scenario 6: Missing Venue ID

```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations" \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer token'
```

**Expected Response:** 400 Bad Request (same as Scenario 5)

---

## API Reference

### Webhook Endpoint

**URL:** `http://localhost:5678/webhook/resy/reservations`  
**Production:** `https://your-n8n-instance.com/webhook/resy/reservations`  
**Method:** `GET`

### Required Headers

| Header | Required | Format | Example |
|--------|----------|--------|---------|
| `X-N8N-API-Key` | ✅ Yes | Custom header | `your-secret-key` |
| `Authorization` | ✅ Yes | `Bearer <token>` | `Bearer eyJhbGc...` |

### Required Query Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| `venueId` | ✅ Yes | Integer | Resy venue ID | `12345` |

### Optional Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `startDate` | Date | Start date for reservations (YYYY-MM-DD) | `2026-06-15` |
| `endDate` | Date | End date for reservations (YYYY-MM-DD) | `2026-06-20` |
| `status` | String | Filter by status (booked, seated, completed, cancelled, no-show) | `booked` |
| `limit` | Integer | Number of reservations per page (default: 20, max: 100) | `50` |
| `offset` | Integer | Offset for pagination (default: 0) | `50` |

---

## Resy API

### Getting Your Venue ID

1. Log in to [Resy OS](https://os.resy.com/)
2. Go to Settings → Venue Information
3. Your venue ID is displayed in the venue details
4. Or contact Resy support for your venue ID

### API Access

- **Platform:** Resy Platform API
- **Authentication:** OAuth 2.0 or API Key
- **Rate Limits:** Varies by plan
- **Documentation:** https://api.resy.com/docs/

### Reservation Statuses

| Status | Description |
|--------|-------------|
| `booked` | Reservation is confirmed |
| `seated` | Guest has been seated |
| `completed` | Reservation completed successfully |
| `cancelled` | Reservation cancelled |
| `no-show` | Guest did not arrive |
| `waitlist` | Guest on waitlist |

### Reservation Data Structure

Reservations from Resy API include:
- **id**: Unique reservation identifier
- **token**: Reservation confirmation token
- **guest**: Guest details (name, email, phone)
- **partySize**: Number of guests
- **date**: Reservation date
- **time**: Reservation time
- **status**: Current reservation status
- **tableType**: Type of seating (Standard, Bar, Patio, etc.)
- **notes**: Special requests
- **payment**: Payment details (if applicable)
- **channel**: Booking source (app, web, phone)

---

## Use Cases

### 1. Daily Reservation Summary
Fetch today's reservations for floor planning:
```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&startDate=$(date +%Y-%m-%d)&endDate=$(date +%Y-%m-%d)"
```

### 2. Upcoming Confirmed Reservations
Get confirmed reservations for the next 7 days:
```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&startDate=$(date +%Y-%m-%d)&endDate=$(date -d '+7 days' +%Y-%m-%d)&status=booked"
```

### 3. No-Show Tracking
Analyze no-show patterns:
```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&status=no-show&startDate=2026-06-01&endDate=2026-06-30"
```

### 4. Waitlist Management
Track waitlist reservations:
```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&status=waitlist"
```

### 5. Reservation Sync
Sync reservations to internal CRM:
```bash
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&startDate=$(date +%Y-%m-%d)"
```

---

## Troubleshooting

### Issue: 400 Bad Request - Missing venueId

**Cause:** `venueId` query parameter is missing

**Solution:**
1. Verify venueId is included in the URL query string
2. Check the venue ID is correct (numeric)
3. Ensure proper URL encoding

### Issue: Empty Reservations Response

**Cause:** No reservations for the specified period or wrong venue ID

**Solution:**
1. Verify the venue ID is correct
2. Check date range includes reservations
3. Verify Resy API access permissions
4. Ensure venue is active in Resy system

### Issue: Invalid Date Format

**Cause:** Date parameters not in correct format

**Solution:**
Use format: `YYYY-MM-DD`
Example: `2026-06-15`

### Issue: Backend Connection Error

**Cause:** Supabase backend is unreachable

**Solution:**
1. Verify backend URL in "Forward to Backend" node
2. Check Supabase backend logs
3. Ensure backend has Resy API credentials configured
4. Verify OAuth token or API key is valid

### Issue: Rate Limit Exceeded

**Cause:** Too many API requests

**Solution:**
1. Implement request throttling
2. Use pagination to reduce request frequency
3. Cache results when possible
4. Contact Resy to increase rate limits

---

## Integration Notes

### Real-Time Updates
- Resy supports webhooks for real-time reservation updates
- Configure webhook notifications in Resy OS dashboard
- Subscribe to events: created, updated, cancelled, no-show, waitlist

### Guest Management
- Link reservations to guest profiles
- Track VIP guests and preferences
- Implement loyalty program integration

### Table Management
- Sync with Resy OS floor plan
- Optimize table assignments
- Track table turnover times

### Payment Integration
- Resy supports prepaid reservations
- Track deposit and cancellation fees
- Integrate with POS systems

---

## Resy vs OpenTable Comparison

| Feature | Resy | OpenTable |
|---------|------|-----------|
| **Target Market** | High-end dining | All restaurant types |
| **API Maturity** | Modern REST API | Established REST API |
| **Real-time Updates** | Webhooks | Webhooks |
| **Payment** | Built-in deposits | Limited payment features |
| **Mobile App** | Strong mobile presence | Strong mobile presence |

---

## Files

- `get-resy-reservations-workflow.json` - Workflow configuration
- `README.md` - This file

---

**Environment:** Development  
**Last Tested:** 2026-06-08  
**Status:** ✅ Ready for Testing

**Note:** Ensure your Resy API credentials have the necessary permissions to access reservation data. Contact Resy support for API access if not already configured.
