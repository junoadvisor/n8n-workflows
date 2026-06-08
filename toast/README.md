# Toast POS Integration

**Provider**: Toast POS  
**Type**: Restaurant Point-of-Sale System  
**Workflows**: 4

This folder contains n8n workflows for integrating with the Toast POS API.

---

## 📋 Available Workflows

### 1. Post Toast Order (POST)

**File**: `post-toast-order-workflow.json`  
**Endpoint**: `/toast/orders`  
**Method**: POST

Create new Toast orders.

**Request Headers**:
```
X-N8N-API-Key: your-webhook-key
Authorization: Bearer <toast-api-token>
Toast-Restaurant-External-ID: <restaurant-guid>
Content-Type: application/json
```

**Request Body**:
```json
{
  "channelGuid": "order-channel-guid",
  "source": "ONLINE_ORDERING",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-0100"
  },
  "items": [...]
}
```

**Example**:
```bash
curl -X POST http://localhost:5678/webhook/toast/orders \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123' \
  -H 'Content-Type: application/json' \
  -d '{"channelGuid": "test", "source": "ONLINE_ORDERING"}'
```

---

### 2. Get Toast Order (GET)

**File**: `get-toast-order-workflow.json`  
**Endpoint**: `/toast/orders/:orderGuid`  
**Method**: GET

Retrieve detailed information about a specific Toast order.

**Path Parameters**:
- `orderGuid` - The unique identifier for the order

**Request Headers**:
```
X-N8N-API-Key: your-webhook-key
Authorization: Bearer <toast-api-token>
Toast-Restaurant-External-ID: <restaurant-guid>
```

**Response**:
```json
{
  "guid": "order-guid",
  "customer": {...},
  "items": [...],
  "payments": [...],
  "totals": {...}
}
```

**Example**:
```bash
curl -X GET "http://localhost:5678/webhook/toast/orders/abc-123" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123'
```

**API Reference**: [Toast Orders API](https://doc.toasttab.com/doc/devguide/apiOrdersGetDetailedInfoAboutOneOrder.html)

---

### 3. Get Toast Menu (GET)

**File**: `get-toast-menu-workflow.json`  
**Endpoint**: `/toast/menus`  
**Method**: GET

Retrieve menu items, groups, modifiers, and pricing.

**Query Parameters** (optional):
- `pageSize` - Number of items per page (default: 100)
- `page` - Page number (default: 1)
- `lastModified` - Filter by last modified date (ISO 8601)

**Request Headers**:
```
X-N8N-API-Key: your-webhook-key
Authorization: Bearer <toast-api-token>
Toast-Restaurant-External-ID: <restaurant-guid>
```

**Response**:
```json
{
  "menuGroups": [
    {
      "guid": "group-1",
      "name": "Main Dishes",
      "items": [
        {
          "guid": "item-1",
          "name": "Burger",
          "price": 12.99,
          "modifiers": [...]
        }
      ]
    }
  ]
}
```

**Example**:
```bash
curl -X GET "http://localhost:5678/webhook/toast/menus?pageSize=50" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123'
```

**API Reference**: [Toast Menus API](https://doc.toasttab.com/openapi/menus/)

---

### 4. Get Toast Restaurants (GET)

**File**: `get-toast-restaurants-workflow.json`  
**Endpoint**: `/toast/restaurants`  
**Method**: GET

Retrieve restaurant configuration information.

**Query Parameters** (optional):
- `pageSize` - Number of items per page (default: 100)
- `page` - Page number (default: 1)
- `lastModified` - Filter by last modified date (ISO 8601)

**Request Headers**:
```
X-N8N-API-Key: your-webhook-key
Authorization: Bearer <toast-api-token>
Toast-Restaurant-External-ID: <restaurant-guid>
```

**Response**:
```json
{
  "restaurants": [
    {
      "guid": "restaurant-guid",
      "name": "Restaurant Name",
      "locationName": "Location Name",
      "description": "Restaurant description",
      "timeZone": "America/New_York",
      "closeoutHour": 4,
      "management": {
        "name": "Management Group Name"
      },
      "prepStationCount": 2,
      "tables": []
    }
  ]
}
```

**Example**:
```bash
curl -X GET "http://localhost:5678/webhook/toast/restaurants" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123'
```

**API Reference**: [Toast Restaurants API](https://doc.toasttab.com/openapi/restaurants/overview/)

---

## 🔐 Authentication

All Toast workflows use **three-layer security**:

### Layer 1: n8n Webhook Authentication
- **Credential**: `SUPABASE-EDGE-API-KEY` (Header Auth)
- **Header**: `X-N8N-API-Key: <your-secret-key>`
- **Failure**: 401 Unauthorized

### Layer 2: Toast API Authentication
- **Header**: `Authorization: Bearer <toast-api-token>`
- **Failure**: 400 Bad Request (missing header)

### Layer 3: Restaurant Identification
- **Header**: `Toast-Restaurant-External-ID: <restaurant-guid>`
- **Failure**: 400 Bad Request (missing header)

---

## ⚙️ Configuration

### Environment Variables

Set these in your n8n instance:

```bash
# Toast API hostname
TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com
```

### n8n Credentials

1. **Webhook Authentication** (`SUPABASE-EDGE-API-KEY`)
   - Type: Header Auth
   - Header Name: `X-N8N-API-Key`
   - Value: Generate strong random key

2. **Toast API Authentication**
   - The `Authorization` header is passed through from the client
   - Not stored in n8n credentials

---

## 🚀 Setup

1. **Import Workflows**:
   - Import all 3 JSON files into n8n
   - Or import selectively based on needs

2. **Configure Webhook Credential**:
   - Create `SUPABASE-EDGE-API-KEY` credential
   - Assign to all 3 workflows

3. **Set Environment Variables**:
   - Configure `TOAST_API_HOSTNAME` in n8n

4. **Activate Workflows**:
   - Toggle Active switch for each workflow
   - Note webhook URLs

5. **Test**:
   - Use curl examples above
   - Verify responses

---

## 🧪 Testing

### With Mock Server

```bash
# Start mock server
node tests/mock-server.js

# Test POST order
node tests/test-workflows.js --mock --provider=toast

# Or manually
curl -X POST http://localhost:3000/webhook/toast/orders \
  -H 'X-N8N-API-Key: test-webhook-key' \
  -H 'Authorization: Bearer mock-token' \
  -H 'Toast-Restaurant-External-ID: test-restaurant' \
  -H 'Content-Type: application/json' \
  -d '{"test": "data"}'
```

### With Real n8n

```bash
# Test with real n8n instance
N8N_URL=http://localhost:5678 node tests/test-workflows.js --real
```

---

## 📊 Workflow Architecture

```
Client Request
    ↓
n8n Webhook Trigger (validates X-N8N-API-Key)
    ↓
Validate Headers (Authorization + Toast-Restaurant-External-ID)
    ├─ ✅ Valid → Continue
    └─ ❌ Invalid → Return 400 Bad Request
    ↓
Log Request (timestamp, headers, params, body)
    ↓
Forward to Toast API
    ↓
Return Response to Client
```

---

## 🐛 Troubleshooting

### 401 Unauthorized
- **Cause**: Invalid or missing `X-N8N-API-Key` header
- **Fix**: Verify webhook credential is configured and header is sent

### 400 Bad Request - "Missing Authorization header"
- **Cause**: `Authorization` header not provided
- **Fix**: Add `Authorization: Bearer <token>` header

### 400 Bad Request - "Missing Toast-Restaurant-External-ID header"
- **Cause**: Restaurant ID header not provided
- **Fix**: Add `Toast-Restaurant-External-ID: <guid>` header

### Connection Error to Toast API
- **Cause**: Backend API unreachable or incorrect URL
- **Fix**: 
  - Verify `TOAST_API_HOSTNAME` environment variable
  - Check Toast API credentials
  - Review n8n execution logs

### Order Not Found (GET)
- **Cause**: Invalid `orderGuid` or order doesn't exist
- **Fix**: Verify order GUID is correct and exists in Toast system

---

## 📖 API Documentation

- **Toast Developer Portal**: https://doc.toasttab.com/
- **Orders API**: https://doc.toasttab.com/doc/devguide/apiOrdersGetDetailedInfoAboutOneOrder.html
- **Menus API**: https://doc.toasttab.com/openapi/menus/
- **Authentication**: https://doc.toasttab.com/doc/devguide/apiAuthentication.html

---

## 📁 Files in This Folder

```
toast/
├── README.md                          # This file
├── post-toast-order-workflow.json     # POST orders
├── get-toast-order-workflow.json      # GET order details
├── get-toast-menu-workflow.json       # GET menu items
├── GET-ORDER-README.md                # (Legacy - can be removed)
├── GET-MENU-README.md                 # (Legacy - can be removed)
├── WORKFLOW-COMPARISON.md             # (Legacy - can be removed)
└── DEPLOYMENT-GUIDE.md                # (Legacy - can be removed)
```

---

## 🔄 Related

- **Main Documentation**: [../README.md](../README.md)
- **Testing Guide**: [../tests/README.md](../tests/README.md)
- **Architecture**: [../docs/reference/ARCHITECTURE.md](../docs/reference/ARCHITECTURE.md)
- **Authentication Guide**: [../docs/reference/AUTHENTICATION-GUIDE.md](../docs/reference/AUTHENTICATION-GUIDE.md)

---

**Status**: ✅ Production Ready  
**Version**: 2.1.1 (POST), 1.0.0 (GET)  
**Last Updated**: 2026-06-08
