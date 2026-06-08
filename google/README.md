# Google Business Profile Integration

This folder contains n8n workflows for integrating with Google Business Profile API to manage reviews.

---

## 📋 Available Workflows

### 1. Get Google Business Reviews
**File:** `get-google-reviews-workflow.json`  
**Endpoint:** `GET /google/reviews`  
**Purpose:** Retrieve reviews for a Google Business Profile location

#### Features:
- Fetch reviews for a specific location
- Pagination support (pageSize, pageToken)
- Sort by update time
- Returns reviewer details, ratings, comments
- Includes business owner replies if they exist

#### Required Parameters:
- **Headers:**
  - `Authorization: Bearer <OAuth-token>` (Mandatory)
  - `X-N8N-API-Key: <webhook-key>` (n8n webhook auth)
- **Query Parameters:**
  - `accountId` (Required) - Google My Business account ID
  - `locationId` (Required) - Location ID
  - `pageSize` (Optional) - Number of reviews per page (default: 50, max: 50)
  - `pageToken` (Optional) - Token for pagination
  - `orderBy` (Optional) - Sort order (e.g., "updateTime desc")

#### Example Request:
```bash
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=123456&locationId=789012&pageSize=10" \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer ya29.a0AfH6..."
```

#### Response Format:
```json
{
  "reviews": [
    {
      "reviewId": "ABC123",
      "reviewer": {
        "displayName": "John Doe",
        "profilePhotoUrl": "https://..."
      },
      "starRating": "FIVE",
      "comment": "Great service!",
      "createTime": "2026-06-01T10:00:00Z",
      "updateTime": "2026-06-01T10:00:00Z",
      "reviewReply": {
        "comment": "Thank you for your feedback!",
        "updateTime": "2026-06-02T09:00:00Z"
      }
    }
  ],
  "nextPageToken": "next_page_token_here",
  "totalReviewCount": 150,
  "averageRating": 4.5
}
```

---

### 2. Reply to Google Business Review
**File:** `put-google-review-reply-workflow.json`  
**Endpoint:** `PUT /google/reviews/reply`  
**Purpose:** Create or update a reply to a specific review

#### Features:
- Reply to customer reviews
- Update existing replies
- Plain text responses (max 4096 characters)
- Automatic timestamp tracking

#### Required Parameters:
- **Headers:**
  - `Authorization: Bearer <OAuth-token>` (Mandatory)
  - `X-N8N-API-Key: <webhook-key>` (n8n webhook auth)
- **Body (JSON):**
  - `accountId` (Required) - Google My Business account ID
  - `locationId` (Required) - Location ID
  - `reviewId` (Required) - Review ID to reply to
  - `comment` (Required) - Your reply text (max 4096 bytes)

#### Example Request:
```bash
curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer ya29.a0AfH6..." \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "123456",
    "locationId": "789012",
    "reviewId": "ABC123",
    "comment": "Thank you for your feedback! We appreciate your business."
  }'
```

#### Response Format:
```json
{
  "comment": "Thank you for your feedback! We appreciate your business.",
  "updateTime": "2026-06-08T10:30:00Z",
  "reviewReplyState": "APPROVED"
}
```

---

## 🔐 Authentication

Both workflows require OAuth 2.0 authentication with Google.

### Required OAuth Scope:
```
https://www.googleapis.com/auth/business.manage
```

### Setup OAuth 2.0 in n8n:

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable "Google My Business API"

2. **Create OAuth 2.0 Credentials:**
   - Navigate to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Add authorized redirect URI: `https://your-n8n-instance/rest/oauth2-credential/callback`

3. **Configure in n8n:**
   - Go to n8n → Settings → Credentials
   - Create new credential → "OAuth2 API"
   - Set:
     - **Grant Type:** Authorization Code
     - **Authorization URL:** `https://accounts.google.com/o/oauth2/v2/auth`
     - **Access Token URL:** `https://oauth2.googleapis.com/token`
     - **Client ID:** Your Google OAuth client ID
     - **Client Secret:** Your Google OAuth client secret
     - **Scope:** `https://www.googleapis.com/auth/business.manage`
     - **Auth URI Query Parameters:** Add `access_type=offline&prompt=consent`
   - Save and connect to Google

4. **Assign Credential to Workflows:**
   - Open each workflow
   - Click on "Forward to Google API" node
   - Assign the OAuth 2.0 credential
   - Save workflow

---

## 🏗️ Architecture Flow

```
API Client (Postman/App)
    ↓
n8n Webhook (with auth)
    ↓
Validation (params/headers)
    ↓
Google Business Profile API
    ↓
Response back to client
```

---

## 📝 Error Handling

### 400 Bad Request
**Cause:** Missing required parameters or headers  
**Response:**
```json
{
  "error": "Missing required parameters",
  "message": "Authorization header and required parameters are missing"
}
```

### 401 Unauthorized
**Cause:** Invalid or expired OAuth token  
**Solution:** Refresh OAuth token in n8n

### 403 Forbidden
**Cause:** Insufficient permissions or location not verified  
**Solution:**
- Ensure OAuth scope includes `business.manage`
- Verify business location in Google My Business
- Check that you're the owner/manager of the location

### 404 Not Found
**Cause:** Invalid accountId, locationId, or reviewId  
**Solution:** Verify the IDs are correct

---

## 🚀 Quick Start

### 1. Import Workflows
Import both JSON files into n8n:
- `get-google-reviews-workflow.json`
- `put-google-review-reply-workflow.json`

### 2. Configure Credentials
Set up OAuth 2.0 credentials as described above

### 3. Activate Workflows
Toggle both workflows to "Active"

### 4. Get Your Account and Location IDs

**Option 1: Use Google My Business API Explorer**
```bash
# List accounts
GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts

# List locations for an account
GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations
```

**Option 2: Use Google Business Profile Manager**
- Go to https://business.google.com/
- Select your business
- The URL will contain your location ID

### 5. Test the Workflows

**Get Reviews:**
```bash
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=YOUR_ACCOUNT_ID&locationId=YOUR_LOCATION_ID" \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN"
```

**Reply to Review:**
```bash
curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
  -H "X-N8N-API-Key: your-webhook-key" \
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "YOUR_ACCOUNT_ID",
    "locationId": "YOUR_LOCATION_ID",
    "reviewId": "REVIEW_ID_FROM_GET_REVIEWS",
    "comment": "Thank you for your review!"
  }'
```

---

## 📊 Use Cases

### 1. Review Monitoring Dashboard
- Fetch all reviews periodically
- Display in a custom dashboard
- Track sentiment and ratings over time

### 2. Automated Reply System
- Use AI (GPT) to generate personalized replies
- Send replies automatically based on rating
- Maintain response time SLA

### 3. Review Analytics
- Aggregate review data
- Identify trends and common themes
- Generate reports for management

### 4. Multi-Location Management
- Manage reviews across multiple locations
- Centralized review response system
- Consistent brand messaging

---

## ⚠️ Important Notes

### Rate Limits
- Google My Business API has rate limits
- Monitor your quota in Google Cloud Console
- Implement exponential backoff for retries

### Review Reply Guidelines
- Maximum reply length: 4096 bytes
- Plain text only (no HTML or markdown)
- Cannot delete reviews (only replies)
- Replies are public and visible to all users

### Service Accounts
- Service accounts **cannot** be used for review management
- You must use standard OAuth 2.0 with user consent
- Each user needs to authorize individually

### G Suite Requirements
- Your G Suite Organization Administrator must enable:
  - Google Search service
  - Google Maps service
  - Business Profile access
- Contact your administrator if you have access issues

---

## 🔗 API Reference

- **Google Business Profile API**: https://developers.google.com/my-business
- **Review Data Guide**: https://developers.google.com/my-business/content/review-data
- **OAuth 2.0 Setup**: https://developers.google.com/identity/protocols/oauth2

---

## 📈 Version History

- **2026-06-08**: Added reply to review workflow (`put-google-review-reply-workflow.json`)
- **2026-06-08**: Updated to call Google API directly (removed Supabase intermediary)
- **2026-06-08**: Initial GET reviews workflow (`get-google-reviews-workflow.json`)

---

## 🆘 Troubleshooting

### "User does not have access to this location"
- Verify you're authenticated as the business owner/manager
- Check the location is verified in Google My Business
- Ensure the OAuth token has the correct scope

### "The location is not yet verified"
- Complete the verification process in Google My Business
- Can take 1-7 days depending on verification method

### "Invalid review reply comment"
- Check comment length (max 4096 bytes)
- Ensure comment is not empty
- Remove any HTML tags or special characters

### OAuth Token Expired
- Tokens typically expire after 1 hour
- Use refresh token to get new access token
- n8n handles refresh automatically if configured correctly

---

**For more information, see the main repository README and ARCHITECTURE.md**
