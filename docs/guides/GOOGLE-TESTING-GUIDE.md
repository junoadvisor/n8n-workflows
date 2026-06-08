# Google Business Profile Workflows - Testing Guide

This guide shows you how to test both Google Business Profile workflows: reading reviews and replying to reviews.

---

## Prerequisites

### 1. OAuth 2.0 Access Token

You need a valid Google OAuth 2.0 access token with the `business.manage` scope.

**Quick way to get a token for testing:**

1. Go to Google OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your OAuth Client ID and Secret
5. In Step 1, scroll down and select:
   - `https://www.googleapis.com/auth/business.manage`
6. Click "Authorize APIs"
7. Sign in with your Google account (must be business owner/manager)
8. Click "Exchange authorization code for tokens"
9. Copy the "Access token" value

### 2. Get Your Account and Location IDs

**Option A: Use Google My Business API Explorer**

Get Account ID:
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://mybusinessaccountmanagement.googleapis.com/v1/accounts
```

Get Location ID (replace {accountId}):
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations"
```

**Option B: From Google Business Profile Manager**
1. Go to https://business.google.com/
2. Select your business
3. The URL contains your location information

### 3. n8n Webhook Key

Your n8n webhook authentication key (set in n8n credentials as `SUPABASE-EDGE-API-KEY`)

---

## Test Workflow 1: Get Reviews

### Request

```bash
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=YOUR_ACCOUNT_ID&locationId=YOUR_LOCATION_ID&pageSize=10" \
  -H "X-N8N-API-Key: your-n8n-webhook-key" \
  -H "Authorization: Bearer YOUR_GOOGLE_OAUTH_TOKEN"
```

### Response Example

```json
{
  "reviews": [
    {
      "reviewId": "ChZDSUhNMG9nS0VJQ0FnSUR6...",
      "reviewer": {
        "displayName": "John Smith",
        "profilePhotoUrl": "https://lh3.googleusercontent.com/...",
        "isAnonymous": false
      },
      "starRating": "FIVE",
      "comment": "Great service and friendly staff. Highly recommend!",
      "createTime": "2026-06-01T14:30:00Z",
      "updateTime": "2026-06-01T14:30:00Z",
      "reviewReply": null
    },
    {
      "reviewId": "ChZDSUhNMG9nS0VJQ0FnSUR6...",
      "reviewer": {
        "displayName": "Sarah Johnson",
        "profilePhotoUrl": "https://lh3.googleusercontent.com/...",
        "isAnonymous": false
      },
      "starRating": "FOUR",
      "comment": "Good experience overall. Wait time was a bit long.",
      "createTime": "2026-05-28T10:15:00Z",
      "updateTime": "2026-06-02T09:00:00Z",
      "reviewReply": {
        "comment": "Thank you for your feedback! We're working on improving our service speed.",
        "updateTime": "2026-06-02T09:00:00Z"
      }
    }
  ],
  "nextPageToken": "CAMQBBgDIhIKEAgBEJK3...",
  "totalReviewCount": 157,
  "averageRating": 4.6
}
```

### What to Check

- ✅ Reviews array is populated
- ✅ Each review has `reviewId`, `reviewer`, `starRating`, `comment`
- ✅ `reviewReply` exists for reviews you've already replied to
- ✅ `nextPageToken` present if there are more reviews
- ✅ HTTP status 200

---

## Test Workflow 2: Reply to Review

### Step 1: Get a Review ID

First, run the GET request above and copy a `reviewId` from the response.

### Step 2: Send Reply

```bash
curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
  -H "X-N8N-API-Key: your-n8n-webhook-key" \
  -H "Authorization: Bearer YOUR_GOOGLE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "YOUR_ACCOUNT_ID",
    "locationId": "YOUR_LOCATION_ID",
    "reviewId": "ChZDSUhNMG9nS0VJQ0FnSUR6...",
    "comment": "Thank you for your wonderful review! We appreciate your business and look forward to serving you again."
  }'
```

### Response Example

```json
{
  "comment": "Thank you for your wonderful review! We appreciate your business and look forward to serving you again.",
  "updateTime": "2026-06-08T10:35:42.123Z",
  "reviewReplyState": "APPROVED"
}
```

### What to Check

- ✅ Response contains your `comment` text
- ✅ `updateTime` is present and recent
- ✅ `reviewReplyState` is "APPROVED"
- ✅ HTTP status 200
- ✅ Reply appears in Google Business Profile Manager

### Step 3: Verify Reply

Go to https://business.google.com/ and check that your reply appears under the review.

---

## Test Workflow 3: Update Existing Reply

You can update a reply by sending another PUT request to the same review:

```bash
curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
  -H "X-N8N-API-Key: your-n8n-webhook-key" \
  -H "Authorization: Bearer YOUR_GOOGLE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "YOUR_ACCOUNT_ID",
    "locationId": "YOUR_LOCATION_ID",
    "reviewId": "ChZDSUhNMG9nS0VJQ0FnSUR6...",
    "comment": "Thank you for your feedback! We have made improvements based on your suggestions."
  }'
```

The reply will be updated with the new text.

---

## Common Test Scenarios

### Scenario 1: Pagination Test

Get reviews in batches:

```bash
# Page 1
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=YOUR_ACCOUNT_ID&locationId=YOUR_LOCATION_ID&pageSize=5"

# Page 2 (use nextPageToken from Page 1 response)
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=YOUR_ACCOUNT_ID&locationId=YOUR_LOCATION_ID&pageSize=5&pageToken=CAMQBBgD..."
```

### Scenario 2: Reply to Multiple Reviews

```bash
# Get reviews
REVIEWS=$(curl -s -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=YOUR_ACCOUNT_ID&locationId=YOUR_LOCATION_ID&pageSize=10" \
  -H "X-N8N-API-Key: your-key" \
  -H "Authorization: Bearer your-token")

# Extract review IDs and reply to each (requires jq)
echo $REVIEWS | jq -r '.reviews[].reviewId' | while read reviewId; do
  curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
    -H "X-N8N-API-Key: your-key" \
    -H "Authorization: Bearer your-token" \
    -H "Content-Type: application/json" \
    -d "{
      \"accountId\": \"YOUR_ACCOUNT_ID\",
      \"locationId\": \"YOUR_LOCATION_ID\",
      \"reviewId\": \"$reviewId\",
      \"comment\": \"Thank you for your review!\"
    }"
  sleep 1  # Rate limiting
done
```

### Scenario 3: Filter Reviews by Rating

Get only low-rated reviews (requires processing response):

```bash
curl -s -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=YOUR_ACCOUNT_ID&locationId=YOUR_LOCATION_ID&pageSize=50" \
  -H "X-N8N-API-Key: your-key" \
  -H "Authorization: Bearer your-token" \
  | jq '.reviews[] | select(.starRating == "ONE" or .starRating == "TWO")'
```

---

## Error Testing

### Test 1: Missing Authorization Header

```bash
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=123&locationId=456" \
  -H "X-N8N-API-Key: your-key"
```

**Expected:** 400 Bad Request
```json
{
  "error": "Missing required parameters",
  "message": "Authorization header and locationId query parameter are required"
}
```

### Test 2: Missing Required Parameters

```bash
curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
  -H "X-N8N-API-Key: your-key" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "123",
    "locationId": "456"
  }'
```

**Expected:** 400 Bad Request
```json
{
  "error": "Missing required parameters",
  "message": "Authorization header and body with accountId, locationId, reviewId, and comment are required"
}
```

### Test 3: Invalid OAuth Token

```bash
curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=123&locationId=456" \
  -H "X-N8N-API-Key: your-key" \
  -H "Authorization: Bearer invalid_token"
```

**Expected:** 401 Unauthorized from Google API

### Test 4: Review Reply Too Long

```bash
# Generate a comment > 4096 bytes
LONG_COMMENT=$(python3 -c "print('x' * 5000)")

curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
  -H "X-N8N-API-Key: your-key" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d "{
    \"accountId\": \"123\",
    \"locationId\": \"456\",
    \"reviewId\": \"abc\",
    \"comment\": \"$LONG_COMMENT\"
  }"
```

**Expected:** 400 Bad Request from Google API

---

## Automated Testing Script

Save this as `test-google-workflows.sh`:

```bash
#!/bin/bash

# Configuration
N8N_INSTANCE="https://your-n8n-instance"
N8N_WEBHOOK_KEY="your-webhook-key"
GOOGLE_TOKEN="your-oauth-token"
ACCOUNT_ID="your-account-id"
LOCATION_ID="your-location-id"

echo "=== Testing Google Business Profile Workflows ==="
echo ""

# Test 1: Get Reviews
echo "Test 1: Get Reviews"
REVIEWS_RESPONSE=$(curl -s -X GET \
  "$N8N_INSTANCE/webhook/google/reviews?accountId=$ACCOUNT_ID&locationId=$LOCATION_ID&pageSize=5" \
  -H "X-N8N-API-Key: $N8N_WEBHOOK_KEY" \
  -H "Authorization: Bearer $GOOGLE_TOKEN")

echo "Response:"
echo $REVIEWS_RESPONSE | jq '.'
echo ""

# Extract first review ID for reply test
REVIEW_ID=$(echo $REVIEWS_RESPONSE | jq -r '.reviews[0].reviewId')

if [ "$REVIEW_ID" != "null" ] && [ -n "$REVIEW_ID" ]; then
  echo "Test 2: Reply to Review (ID: $REVIEW_ID)"
  
  REPLY_RESPONSE=$(curl -s -X PUT \
    "$N8N_INSTANCE/webhook/google/reviews/reply" \
    -H "X-N8N-API-Key: $N8N_WEBHOOK_KEY" \
    -H "Authorization: Bearer $GOOGLE_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"accountId\": \"$ACCOUNT_ID\",
      \"locationId\": \"$LOCATION_ID\",
      \"reviewId\": \"$REVIEW_ID\",
      \"comment\": \"Thank you for your review! [Automated test reply at $(date)]\"
    }")
  
  echo "Response:"
  echo $REPLY_RESPONSE | jq '.'
  echo ""
else
  echo "No reviews found to test reply workflow"
fi

echo "=== Tests Complete ==="
```

Run with: `chmod +x test-google-workflows.sh && ./test-google-workflows.sh`

---

## Performance Testing

### Load Test: Get Reviews

```bash
# Send 10 concurrent requests
for i in {1..10}; do
  curl -X GET "https://your-n8n-instance/webhook/google/reviews?accountId=$ACCOUNT_ID&locationId=$LOCATION_ID" \
    -H "X-N8N-API-Key: your-key" \
    -H "Authorization: Bearer your-token" &
done
wait
```

### Load Test: Reply to Reviews

```bash
# Send 5 concurrent replies (be cautious with rate limits)
for i in {1..5}; do
  curl -X PUT https://your-n8n-instance/webhook/google/reviews/reply \
    -H "X-N8N-API-Key: your-key" \
    -H "Authorization: Bearer your-token" \
    -H "Content-Type: application/json" \
    -d "{
      \"accountId\": \"$ACCOUNT_ID\",
      \"locationId\": \"$LOCATION_ID\",
      \"reviewId\": \"review-$i\",
      \"comment\": \"Test reply $i\"
    }" &
done
wait
```

---

## Monitoring

Monitor workflow execution in n8n:

1. Open n8n web interface
2. Go to **Executions**
3. Filter by workflow name
4. Check execution logs for errors
5. Monitor response times

---

## Troubleshooting

### Issue: "User does not have access to this location"
**Solution:** Verify you're authenticated as the business owner/manager

### Issue: "Invalid review reply comment"
**Solution:** Check comment length (max 4096 bytes), ensure it's not empty

### Issue: Token expired
**Solution:** Refresh OAuth token (expires after 1 hour)

### Issue: Rate limit exceeded
**Solution:** Implement exponential backoff, reduce request frequency

---

**For more details, see [google/README.md](./README.md)**
