# NeuralTable n8n Workflows

**Last Updated:** 2026-06-08  
**Status:** Development  
**Architecture:** Direct Backend API Calls (v2.0)

This repository contains n8n workflows for integrating external services with NeuralTable. All workflows call backend APIs directly (Toast, Google, OpenTable, Yelp, Resy, Instagram, Facebook) without intermediaries, implementing secure authentication and request validation.

## 🏗️ Architecture

```
API Client (Postman/Edge/etc.) → n8n Workflow → Backend API (Toast/Google/etc.)
```

**Key Principles:**
1. ✅ **Direct API Calls**: n8n communicates directly with backend APIs
2. ✅ **No Intermediaries**: Removed Supabase Edge Functions layer
3. ✅ **Standard HTTP**: Request validation → API call → Response forwarding
4. ✅ **Secure Authentication**: Each backend API uses its native authentication

**📖 Documentation:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture documentation
- [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) - Migration from Supabase architecture

---

## 📚 Documentation

Complete documentation is available in the [`docs/`](./docs/) directory:

- **[Documentation Index](./docs/README.md)** - Complete documentation navigation
- **[Architecture Guide](./docs/reference/ARCHITECTURE.md)** - System architecture and API endpoints
- **[Authentication Guide](./docs/reference/AUTHENTICATION-GUIDE.md)** - Authentication per provider
- **[Migration Guide](./docs/guides/MIGRATION-GUIDE.md)** - Deploy workflows to n8n
- **[Google Testing Guide](./docs/guides/GOOGLE-TESTING-GUIDE.md)** - Test Google workflows
- **[Verification Scripts](./docs/scripts/)** - Automated verification tools

---

## 📁 Folder Structure

```
n8n-workflows/
├── README.md                          # This file - project overview
├── CHANGELOG.md                       # Version history
│
├── docs/                              # 📚 Documentation hub
│   ├── README.md                      # Documentation index
│   ├── guides/                        # Step-by-step guides
│   │   ├── MIGRATION-GUIDE.md
│   │   └── GOOGLE-TESTING-GUIDE.md
│   ├── reference/                     # Technical reference
│   │   ├── ARCHITECTURE.md
│   │   ├── AUTHENTICATION-GUIDE.md
│   │   └── QUICK-REFERENCE.md
│   └── scripts/                       # (Deprecated - see tests/)
│       └── DEPRECATION-NOTICE.md
│
├── tests/                            # 🧪 Testing scripts
│   ├── test-workflows.js              # Main test runner (JavaScript)
│   ├── mock-server.js                 # Mock n8n server (JavaScript)
│   └── README.md                      # Testing documentation
│
├── toast/                             # Toast POS integration
│   ├── post-toast-order-workflow.json
│   └── README.md
│
├── google/                            # Google Business Profile
│   ├── get-google-reviews-workflow.json
│   ├── put-google-review-reply-workflow.json
│   └── README.md
│
├── yelp/                              # Yelp Fusion & Partner API
│   ├── get-yelp-reviews-workflow.json
│   ├── put-yelp-review-reply-workflow.json
│   └── README.md
│
├── opentable/                         # OpenTable Platform
│   ├── get-opentable-reservations-workflow.json
│   └── README.md
│
├── resy/                              # Resy API
│   ├── get-resy-reservations-workflow.json
│   └── README.md
│
├── instagram/                         # Instagram Graph API
│   ├── post-instagram-content-workflow.json
│   ├── post-instagram-comment-workflow.json
│   └── README.md
│
└── facebook/                          # Facebook Graph API
    ├── post-facebook-content-workflow.json
    ├── post-facebook-comment-workflow.json
    └── README.md
```

---

## 🚀 Available Integrations

### 1. Toast POS Integration
**Location:** `/toast/`

Workflows for managing Toast POS orders, menus, and restaurant configuration:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Post Toast Order | POST | `/toast/orders` | Create new orders |
| Get Toast Order | GET | `/toast/orders/:orderGuid` | Retrieve order details |
| Get Toast Menu | GET | `/toast/menus` | Retrieve menu items |
| Get Toast Restaurants | GET | `/toast/restaurants` | Retrieve restaurant configuration |

**Documentation:** [toast/README.md](./toast/README.md)

---

### 2. Google Business Profile Integration
**Location:** `/google/`

Workflows for managing Google Business Profile reviews:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Get Google Reviews | GET | `/google/reviews` | Retrieve Google Business reviews |
| Reply to Review | PUT | `/google/reviews/reply` | Create or update review replies |

**Features:**
- **Read Reviews**: Pagination, sorting, reviewer details, ratings, comments
- **Reply to Reviews**: Create/update replies (max 4096 characters)
- OAuth 2.0 authentication with `business.manage` scope
- Business owner/manager verification required

**Documentation:** [google/README.md](./google/README.md)

**API Reference:** [Google Business Profile API](https://developers.google.com/my-business/reference/rest)

---

### 3. Yelp Fusion & Partner API Integration
**Location:** `/yelp/`

Workflows for retrieving and responding to Yelp business reviews:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Get Yelp Reviews | GET | `/yelp/reviews` | Retrieve Yelp business reviews |
| Reply to Review | POST | `/yelp/reviews/reply` | Respond to Yelp reviews (Partner API) |

**Features:**
- **Get Reviews**: Pagination support (limit, offset), sort options, reviewer details
- **Reply to Reviews**: Post public responses (requires Yelp Partner API access)
- Maximum 3 reviews per business (Fusion API limitation)
- Reply rate limit: 20 responses per location per day
- UTF-8 text only (emojis not supported)

**Documentation:** [yelp/README.md](./yelp/README.md)

**API References:** 
- [Yelp Fusion API](https://docs.developer.yelp.com/reference/v3_business_reviews)
- [Yelp Respond to Reviews API](https://docs.developer.yelp.com/docs/respond-to-reviews-api-v2)

---

### 4. OpenTable Reservation Integration
**Location:** `/opentable/`

Workflows for retrieving OpenTable restaurant reservations:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Get OpenTable Reservations | GET | `/opentable/reservations` | Retrieve restaurant reservations |

**Features:**
- Date range filtering (startDate, endDate)
- Status filtering (confirmed, seated, completed, cancelled, no-show)
- Pagination support (pageSize, page)
- Returns guest details, party size, table assignments
- Special requests and tags

**Documentation:** [opentable/README.md](./opentable/README.md)

**API Reference:** [OpenTable Platform API](https://platform.opentable.com/documentation/)

---

### 5. Resy Reservation Integration
**Location:** `/resy/`

Workflows for retrieving Resy restaurant reservations:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Get Resy Reservations | GET | `/resy/reservations` | Retrieve restaurant reservations |

**Features:**
- Date range filtering (startDate, endDate)
- Status filtering (booked, seated, completed, cancelled, no-show, waitlist)
- Pagination support (limit, offset)
- Returns guest details, party size, payment info
- Table type and special notes
- Waitlist management

**Documentation:** [resy/README.md](./resy/README.md)

**API Reference:** [Resy Platform API](https://api.resy.com/docs/)

---

### 6. Instagram Social Media Integration
**Location:** `/instagram/`

Workflows for Instagram content creation and engagement:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Post Content | POST | `/instagram/posts` | Create Instagram posts |
| Post Comment | POST | `/instagram/comments` | Comment on Instagram posts |
| Reply to Comment | PUT | `/instagram/comments/reply` | Reply to existing comments |

**Features:**
- Post photos, videos, carousels, stories, reels
- Schedule posts for later publishing
- Add captions, hashtags, location tags
- Reply to comments and DMs
- User tagging and mentions
- Content moderation

**Documentation:** [instagram/README.md](./instagram/README.md)

**API Reference:** [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

**Requirements:**
- Instagram Business Account
- Facebook Page connection
- Facebook App with required permissions

---

### 7. Facebook Social Media Integration
**Location:** `/facebook/`

Workflows for Facebook page content management:

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Post Content | POST | `/facebook/posts` | Create Facebook page posts |
| Post Comment | POST | `/facebook/comments` | Comment on Facebook posts |
| Reply to Comment | PUT | `/facebook/comments/reply` | Reply to existing comments |

**Features:**
- Post text, photos, videos, links
- Share multiple photos (albums)
- Schedule posts for optimal timing
- Comment on posts and replies
- Geographic and demographic targeting
- Event and offer creation
- Content analytics integration

**Documentation:** [facebook/README.md](./facebook/README.md)

**API Reference:** [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

**Requirements:**
- Facebook Page admin/editor role
- Facebook App with pages permissions

---

## 🔐 Security Architecture

All workflows share the same security pattern:

### Layer 1: n8n Webhook Authentication
- **Credential:** `SUPABASE-EDGE-API-KEY` (or custom credential name)
- **Type:** Header Auth
- **Failure:** 401 Unauthorized

### Layer 2: Backend API Authentication
- **Each backend API has its own authentication**
- **Toast:** Bearer token + `Toast-Restaurant-External-ID` header
- **Google:** OAuth 2.0 token
- **Yelp:** Bearer token (API Key)
- **OpenTable:** OAuth 2.0 token (Client Credentials)
- **Resy:** Custom header auth (`ResyAPI api_key="..."`)
- **Instagram/Facebook:** OAuth 2.0 token

### Layer 3: Request Validation
- **Validates Authorization headers**
- **Validates required parameters** (orderGuid, locationId, businessId, etc.)
- **Returns 400 Bad Request** if validation fails

---

## 📦 Quick Start

### 1. Configure Environment Variables

Set these in your n8n instance (docker-compose.yml, .env, or systemd service):

```bash
# Toast POS API
TOAST_API_HOSTNAME=https://your-toast-hostname.toasttab.com

# Google My Business API
GOOGLE_MY_BUSINESS_API_URL=https://mybusiness.googleapis.com
```

### 2. Configure n8n Webhook Credential

All workflows use the same webhook authentication credential:

1. Open n8n: http://localhost:5678
2. Go to **Credentials** > **Create New Credential**
3. Select **Header Auth**
4. Configure:
   - **Name:** `SUPABASE-EDGE-API-KEY`
   - **Header Name:** `X-N8N-API-Key`
   - **Value:** Generate a strong random key (e.g., `openssl rand -hex 32`)
5. Click **Save**

### 3. Configure Backend API Credentials

Set up credentials for each backend service you're using:

**Toast POS:**
- Type: Generic Credential or Header Auth
- Headers: `Authorization: Bearer <token>`, `Toast-Restaurant-External-ID: <guid>`

**Google Business Profile:**
- Type: OAuth2 API
- Follow Google OAuth setup: https://developers.google.com/my-business

**Yelp Fusion:**
- Type: Header Auth
- Header: `Authorization: Bearer <YELP_API_KEY>`
- Get API Key: https://www.yelp.com/developers

**OpenTable:**
- Type: OAuth2 API (Client Credentials)
- Register: https://www.opentable.com/restaurant-solutions/api-partners/

**Resy:**
- Type: Header Auth
- Header: `Authorization: ResyAPI api_key="<KEY>"`

**Instagram/Facebook:**
- Type: OAuth2 API
- Setup: https://developers.facebook.com/

### 4. Import Workflows

Choose the integrations you need:

```bash
# Toast POS workflows
toast/post-toast-order-workflow.json
toast/get-toast-order-workflow.json
toast/get-toast-menu-workflow.json

# Review management workflows
google/get-google-reviews-workflow.json
yelp/get-yelp-reviews-workflow.json

# Reservation management workflows
opentable/get-opentable-reservations-workflow.json
resy/get-resy-reservations-workflow.json

# Social media workflows
instagram/post-instagram-content-workflow.json
instagram/post-instagram-comment-workflow.json
facebook/post-facebook-content-workflow.json
facebook/post-facebook-comment-workflow.json
```

### 3. Configure Backend URLs

Each workflow's backend URL is configurable in the "Forward to Backend" node:

- **Toast:** `https://your-backend.com/functions/v1/orders`
- **Google:** `https://your-backend.com/functions/v1/google/reviews`
- **Yelp:** `https://your-backend.com/functions/v1/yelp/reviews`
- **OpenTable:** `https://your-backend.com/functions/v1/opentable/reservations`
- **Resy:** `https://your-backend.com/functions/v1/resy/reservations`
- **Instagram:** `https://your-backend.com/functions/v1/instagram/posts` (and comments)
- **Facebook:** `https://your-backend.com/functions/v1/facebook/posts` (and comments)

### 4. Activate Workflows

1. Assign `SUPABASE-EDGE-API-KEY` credential to each workflow
2. Toggle **Active** switch for each workflow
3. Note the webhook URLs

---

## 🧪 Testing

### Automated Testing

We provide comprehensive test scripts for all workflows:

```bash
# Start mock server
node tests/mock-server.js

# In another terminal, run tests
node tests/test-workflows.js --mock

# Test specific provider
node tests/test-workflows.js --mock --provider=google

# Test with real n8n instance
node tests/test-workflows.js --real
```

**Documentation:** [tests/README.md](./tests/README.md)

### Manual Testing Examples

#### Toast Orders

```bash
# Create order
curl -X POST http://localhost:5678/webhook/toast/orders \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123' \
  -d '{"channelGuid": "test", "source": "ONLINE_ORDERING"}'

# Get order
curl -X GET "http://localhost:5678/webhook/toast/orders/order-guid" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123'

# Get menu
curl -X GET "http://localhost:5678/webhook/toast/menus" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Toast-Restaurant-External-ID: restaurant-123'
```

#### Google Reviews

```bash
# Get reviews
curl -X GET "http://localhost:5678/webhook/google/reviews?locationId=ChIJN1t_tDeuEmsRUsoyG83frY4" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'

# Reply to review
curl -X PUT "http://localhost:5678/webhook/google/reviews/reply" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token' \
  -H 'Content-Type: application/json' \
  -d '{"accountId": "123", "locationId": "456", "reviewId": "789", "comment": "Thank you!"}'
```

#### Yelp Reviews

```bash
curl -X GET "http://localhost:5678/webhook/yelp/reviews?businessId=WavvLdfdP6g8aZTtbBQHTw" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'
```

#### OpenTable Reservations

```bash
# Get all reservations
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'

# Get reservations with date range
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&startDate=2026-06-15&endDate=2026-06-20" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'

# Get only confirmed reservations
curl -X GET "http://localhost:5678/webhook/opentable/reservations?restaurantId=123456&status=confirmed" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'
```

#### Resy Reservations

```bash
# Get all reservations
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'

# Get reservations with date range
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&startDate=2026-06-15&endDate=2026-06-20" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'

# Get waitlist reservations
curl -X GET "http://localhost:5678/webhook/resy/reservations?venueId=12345&status=waitlist" \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer token'
```

#### Instagram Posts

```bash
# Post photo to Instagram
curl -X POST http://localhost:5678/webhook/instagram/posts \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer fb-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "accountId": "17841400123456789",
    "mediaType": "IMAGE",
    "imageUrl": "https://example.com/dish.jpg",
    "caption": "Todays special! 🍝 #pasta #italian"
  }'

# Comment on Instagram post
curl -X POST http://localhost:5678/webhook/instagram/comments \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer fb-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "mediaId": "17895695668004550",
    "message": "Thank you for your feedback! 🙏"
  }'
```

#### Facebook Posts

```bash
# Post to Facebook page
curl -X POST http://localhost:5678/webhook/facebook/posts \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer fb-page-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "pageId": "123456789012345",
    "message": "Join us tonight for live music! 🎵 Starts at 8 PM",
    "published": true
  }'

# Comment on Facebook post
curl -X POST http://localhost:5678/webhook/facebook/comments \
  -H 'X-N8N-API-Key: your-key' \
  -H 'Authorization: Bearer fb-page-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "objectId": "123456789012345_987654321098765",
    "message": "Thank you for visiting us! Hope to see you again soon 😊"
  }'
```

---

## 📊 Workflow Comparison

| Feature | Toast | Google | Yelp | OpenTable | Resy | Instagram | Facebook |
|---------|-------|--------|------|-----------|------|-----------|----------|
| **Type** | POS | Reviews | Reviews | Reservations | Reservations | Social Media | Social Media |
| **Workflows** | 3 | 1 | 1 | 1 | 1 | 2 | 2 |
| **Methods** | POST, GET | GET | GET | GET | GET | POST | POST |
| **Auth Layers** | 3 | 2 | 2 | 2 | 2 | 2 | 2 |
| **Pagination** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ N/A | ❌ N/A |
| **Scheduling** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Media Support** | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Rate Limits** | High | 50K/day | 5K/day | Varies | Varies | 25 posts/day | 50 posts/day |
| **Data Volume** | Unlimited | Unlimited | Max 3 | Unlimited | Unlimited | Unlimited | Unlimited |

---

## 🛠️ Backend Requirements

Each integration requires corresponding Supabase Edge Functions:

### Toast Backend
```
POST   /functions/v1/orders
GET    /functions/v1/orders/:guid
GET    /functions/v1/menus
```

### Google Backend
```
GET    /functions/v1/google/reviews
```
- Requires Google Business Profile API credentials
- Handles OAuth token management

### Yelp Backend
```
GET    /functions/v1/yelp/reviews
```
- Requires Yelp Fusion API key
- Handles rate limiting

### OpenTable Backend
```
GET    /functions/v1/opentable/reservations
```
- Requires OpenTable API credentials
- Handles OAuth 2.0 authentication
- Supports date range and status filtering

### Resy Backend
```
GET    /functions/v1/resy/reservations
```
- Requires Resy API credentials
- Handles OAuth 2.0 or API key authentication
- Supports waitlist management

### Instagram Backend
```
POST   /functions/v1/instagram/posts
POST   /functions/v1/instagram/comments
```
- Requires Instagram Business Account
- Facebook Page connection required
- Graph API token management
- Media upload handling
- Content scheduling

### Facebook Backend
```
POST   /functions/v1/facebook/posts
POST   /functions/v1/facebook/comments
```
- Requires Facebook Page access token
- Graph API integration
- Media and link handling
- Geographic/demographic targeting
- Scheduled publishing

---

## 📖 Documentation

- **Toast POS:** [toast/README.md](./toast/README.md)
- **Google Reviews:** [google/README.md](./google/README.md)
- **Yelp Reviews:** [yelp/README.md](./yelp/README.md)
- **OpenTable Reservations:** [opentable/README.md](./opentable/README.md)
- **Resy Reservations:** [resy/README.md](./resy/README.md)
- **Instagram Social:** [instagram/README.md](./instagram/README.md)
- **Facebook Social:** [facebook/README.md](./facebook/README.md)

---

## 🔧 Common Operations

### View All Active Workflows

```bash
curl http://localhost:5678/rest/workflows
```

### Monitor Execution Logs

Check n8n UI → **Executions** for detailed logs

### Update Backend URLs

1. Open workflow in n8n
2. Click "Forward to Backend" node
3. Update `url` field
4. Save and test

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized

**Solution:** Verify `SUPABASE-EDGE-API-KEY` credential is configured and assigned

### Issue: 400 Bad Request

**Solution:** Check all required headers/parameters are present

### Issue: Backend Connection Error

**Solution:** 
1. Verify backend URL in workflow
2. Check Supabase backend is running
3. Review backend logs

---

## 📝 Version History

- **2026-06-08:** Added Google Business Profile reply to review workflow (PUT)
- **2026-06-08:** Updated all workflows to call backend APIs directly (removed Supabase)
- **2026-06-08:** Added Instagram and Facebook social media workflows
- **2026-06-08:** Added OpenTable and Resy reservation workflows
- **2026-06-08:** Added Google and Yelp review workflows (GET)
- **2026-06-08:** Reorganized into folder structure (7 integrations)
- **2026-06-08:** Created Toast menu workflow (v1.0.0)
- **2026-06-08:** Created Toast order GET workflow (v1.0.0)
- **2026-06-05:** Created Toast order POST workflow (v2.1.1)

---

## 🚦 Status

| Integration | Type | Status | Workflows | Version |
|-------------|------|--------|-----------|---------|
| **Toast** | POS | ✅ Production-Ready | 4 | v2.1.1, v1.0.0 |
| **Google** | Reviews | ✅ Production-Ready | 2 | v1.0.0 |
| **Yelp** | Reviews | ✅ Production-Ready | 2 | v1.0.0 |
| **OpenTable** | Reservations | 🆕 New | 1 | v1.0.0 |
| **Resy** | Reservations | 🆕 New | 1 | v1.0.0 |
| **Instagram** | Social Media | ✅ Production-Ready | 3 | v1.0.0 |
| **Facebook** | Social Media | ✅ Production-Ready | 3 | v1.0.0 |

**Total Integrations:** 7  
**Total Workflows:** 16

---

## 📞 Support

For issues or questions:
1. Check folder-specific README files
2. Review workflow execution logs in n8n
3. Verify all credentials and parameters
4. Consult API documentation links

---

**Repository:** `/Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows`  
**n8n URL:** http://localhost:5678  
**Environment:** Development
