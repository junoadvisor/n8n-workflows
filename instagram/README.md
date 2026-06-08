# Instagram Integration Workflows

**Version:** 1.0.0  
**Last Updated:** 2026-06-08  
**Status:** Development  

This folder contains n8n workflows for Instagram social media integration with **mandatory header authentication**, enabling automated posting and commenting on Instagram.

---

## Available Workflows

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Post Content | POST | `/instagram/posts` | Create Instagram posts |
| Post Comment | POST | `/instagram/comments` | Comment on Instagram posts |

---

## Overview

### Instagram API Integration

These workflows integrate with Instagram Graph API (via Facebook) to:
- Create posts (photos, videos, carousels, stories)
- Reply to comments and direct messages
- Manage business account content
- Schedule posts for later publishing

**API Reference:** [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

---

## Workflow 1: Post Instagram Content

### Endpoint
```
POST /instagram/posts
```

### Purpose
Create and publish content to Instagram business accounts.

### Supported Content Types
- Single photos
- Multiple photos (carousel)
- Videos
- Stories
- Reels

### Request Body

```json
{
  "accountId": "instagram-business-account-id",
  "mediaType": "IMAGE",
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check out our new menu! #food #restaurant",
  "locationId": "123456789",
  "hashtags": ["food", "restaurant", "delicious"],
  "schedule": "2026-06-15T19:00:00Z"
}
```

### Required Fields
- `accountId` - Instagram Business Account ID
- `mediaType` - IMAGE, VIDEO, CAROUSEL_ALBUM
- `imageUrl` or `videoUrl` - Media URL

### Optional Fields
- `caption` - Post caption (max 2,200 characters)
- `locationId` - Location ID for tagging
- `hashtags` - Array of hashtags (max 30)
- `schedule` - ISO 8601 timestamp for scheduled post
- `userTags` - Array of user mentions

### Example Request

```bash
curl -X POST http://localhost:5678/webhook/instagram/posts \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "accountId": "17841400123456789",
    "mediaType": "IMAGE",
    "imageUrl": "https://example.com/special-dish.jpg",
    "caption": "Todays special! Fresh seafood pasta 🍝 #seafood #pasta #italian",
    "hashtags": ["seafood", "pasta", "italian", "finedining"]
  }'
```

### Response

```json
{
  "success": true,
  "postId": "17895695668004550",
  "permalink": "https://www.instagram.com/p/ABC123def456/",
  "publishedAt": "2026-06-08T14:30:00Z"
}
```

---

## Workflow 2: Post Instagram Comment

### Endpoint
```
POST /instagram/comments
```

### Purpose
Reply to comments on Instagram posts or leave comments on other posts.

### Request Body

```json
{
  "mediaId": "17895695668004550",
  "message": "Thank you for your feedback! 🙏",
  "replyToCommentId": "17846368586123456"
}
```

### Required Fields
- `mediaId` - Instagram media ID
- `message` - Comment text (max 2,200 characters)

### Optional Fields
- `replyToCommentId` - ID of comment to reply to (for nested replies)

### Example Request

```bash
curl -X POST http://localhost:5678/webhook/instagram/comments \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "mediaId": "17895695668004550",
    "message": "Thank you for visiting us! Hope to see you again soon 😊",
    "replyToCommentId": "17846368586123456"
  }'
```

### Response

```json
{
  "success": true,
  "commentId": "17873440072123456",
  "message": "Thank you for visiting us! Hope to see you again soon 😊",
  "createdAt": "2026-06-08T14:35:00Z"
}
```

---

## Security Features

### 🔐 Two-Layer Security

#### Layer 1: Header Authentication
- **Credential:** `SUPABASE-EDGE-API-KEY`
- **Type:** Header Auth
- **Failure:** 401 Unauthorized

#### Layer 2: Authorization Header (MANDATORY)
- **Format:** `Bearer <facebook-access-token>`
- **Required:** Yes
- **Failure:** 400 Bad Request

### Access Token Requirements
- Instagram Business Account
- Facebook Page connected to Instagram
- Required permissions:
  - `instagram_basic`
  - `instagram_content_publish`
  - `instagram_manage_comments`
  - `pages_read_engagement`
  - `pages_manage_posts`

---

## Setup Instructions

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Graph API product
4. Configure permissions

### Step 2: Get Access Token

1. Use Facebook Login to authenticate
2. Request required permissions
3. Exchange short-lived token for long-lived token
4. Store token securely

### Step 3: Get Instagram Business Account ID

```bash
curl -X GET \
  'https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_TOKEN'
```

### Step 4: Import Workflows

1. Import `post-instagram-content-workflow.json`
2. Import `post-instagram-comment-workflow.json`
3. Assign `SUPABASE-EDGE-API-KEY` credential
4. Configure backend URLs
5. Activate workflows

---

## Use Cases

### 1. Automated Content Publishing
Schedule and publish daily specials, promotions, and events:
```json
{
  "accountId": "17841400123456789",
  "mediaType": "IMAGE",
  "imageUrl": "https://cdn.example.com/daily-special.jpg",
  "caption": "Today's Chef Special: Grilled Salmon with Asparagus 🐟",
  "schedule": "2026-06-15T11:00:00Z"
}
```

### 2. Customer Engagement
Reply to customer comments automatically:
```json
{
  "mediaId": "17895695668004550",
  "message": "Thank you for your kind words! We appreciate your support 🙏",
  "replyToCommentId": "17846368586123456"
}
```

### 3. User-Generated Content
Share customer photos with proper credit:
```json
{
  "accountId": "17841400123456789",
  "mediaType": "IMAGE",
  "imageUrl": "https://example.com/customer-photo.jpg",
  "caption": "Loving this shot from @customer_username! 📸",
  "userTags": [{"username": "customer_username", "x": 0.5, "y": 0.5}]
}
```

### 4. Story Updates
Post time-sensitive stories:
```json
{
  "accountId": "17841400123456789",
  "mediaType": "STORY",
  "imageUrl": "https://example.com/story.jpg",
  "caption": "Happy Hour starts in 30 minutes! 🍹"
}
```

---

## Content Best Practices

### Image Specifications
- **Format:** JPG, PNG
- **Aspect Ratio:** 
  - Square: 1:1 (1080x1080px)
  - Portrait: 4:5 (1080x1350px)
  - Landscape: 1.91:1 (1080x566px)
- **Max File Size:** 8MB

### Video Specifications
- **Format:** MP4, MOV
- **Length:** 3-60 seconds (feed), 15 seconds (stories)
- **Aspect Ratio:** Same as images
- **Max File Size:** 100MB

### Caption Guidelines
- Max 2,200 characters
- First 125 characters visible without "more"
- Max 30 hashtags
- Use emojis for engagement

### Hashtag Strategy
- Mix of popular and niche hashtags
- Location-based hashtags
- Brand-specific hashtags
- 5-10 hashtags optimal

---

## Rate Limits

| Action | Limit |
|--------|-------|
| Posts per day | 25 |
| Comments per hour | 60 |
| API calls per hour | 200 |
| Hashtags per post | 30 |

---

## Error Handling

### Common Errors

**400 Bad Request**
- Invalid media URL
- Caption too long
- Too many hashtags

**403 Forbidden**
- Missing permissions
- Account not business account
- Content violates policies

**429 Too Many Requests**
- Rate limit exceeded
- Wait and retry

**500 Internal Server Error**
- Instagram API issue
- Retry with exponential backoff

---

## Troubleshooting

### Issue: Access Token Expired

**Solution:**
1. Tokens expire after 60 days
2. Implement token refresh
3. Use long-lived tokens
4. Monitor token expiration

### Issue: Media Upload Failed

**Solution:**
1. Verify media URL is publicly accessible
2. Check file size and format
3. Ensure correct aspect ratio
4. Use HTTPS URLs only

### Issue: Comment Not Posted

**Solution:**
1. Verify comment permissions
2. Check if commenting is enabled on post
3. Ensure message meets content guidelines
4. Check for spam filters

---

## Backend Requirements

Supabase Edge Functions needed:

```typescript
// Instagram Posts Backend
POST /functions/v1/instagram/posts
  - Validate access token
  - Upload media to Instagram
  - Create container
  - Publish post
  - Handle scheduling

// Instagram Comments Backend  
POST /functions/v1/instagram/comments
  - Validate access token
  - Post comment
  - Handle nested replies
  - Moderate content
```

---

## Files

- `post-instagram-content-workflow.json` - Post content workflow
- `post-instagram-comment-workflow.json` - Post comment workflow
- `README.md` - This file

---

**Environment:** Development  
**Last Tested:** 2026-06-08  
**Status:** ✅ Ready for Testing

**Note:** Requires Instagram Business Account and Facebook Page connection. Personal Instagram accounts are not supported by the Graph API.
