# Facebook Integration Workflows

**Version:** 1.0.0  
**Last Updated:** 2026-06-08  
**Status:** Development  

This folder contains n8n workflows for Facebook social media integration with **mandatory header authentication**, enabling automated posting and commenting on Facebook pages.

---

## Available Workflows

| Workflow | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| Post Content | POST | `/facebook/posts` | Create Facebook page posts |
| Post Comment | POST | `/facebook/comments` | Comment on Facebook posts |

---

## Overview

### Facebook Graph API Integration

These workflows integrate with Facebook Graph API to:
- Create posts on Facebook pages
- Share photos, videos, links, and text updates
- Comment on posts
- Reply to comments
- Schedule content for later publishing

**API Reference:** [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

---

## Workflow 1: Post Facebook Content

### Endpoint
```
POST /facebook/posts
```

### Purpose
Create and publish content to Facebook pages.

### Supported Content Types
- Text posts
- Photo posts
- Video posts
- Link shares
- Multiple photos (album)
- Events
- Offers

### Request Body

```json
{
  "pageId": "123456789012345",
  "message": "Check out our new summer menu! Fresh, local ingredients 🌱",
  "link": "https://example.com/summer-menu",
  "published": true,
  "scheduledPublishTime": "2026-06-15T19:00:00Z"
}
```

### Required Fields
- `pageId` - Facebook Page ID
- `message` or media content

### Optional Fields
- `message` - Post text (up to 63,206 characters)
- `link` - URL to share
- `photoUrl` - Photo URL
- `videoUrl` - Video URL
- `published` - Publish immediately (true) or save as draft (false)
- `scheduledPublishTime` - Unix timestamp for scheduled post
- `targeting` - Geographic or demographic targeting
- `feedTargeting` - News feed targeting

### Example Requests

#### Text Post
```bash
curl -X POST http://localhost:5678/webhook/facebook/posts \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "pageId": "123456789012345",
    "message": "Join us tonight for live music! 🎵 Starts at 8 PM",
    "published": true
  }'
```

#### Photo Post
```bash
curl -X POST http://localhost:5678/webhook/facebook/posts \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "pageId": "123456789012345",
    "message": "Fresh catch of the day! 🐟",
    "photoUrl": "https://example.com/fish-special.jpg",
    "published": true
  }'
```

#### Link Share
```bash
curl -X POST http://localhost:5678/webhook/facebook/posts \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "pageId": "123456789012345",
    "message": "Read our latest blog post about sustainable dining",
    "link": "https://example.com/blog/sustainable-dining",
    "published": true
  }'
```

#### Scheduled Post
```bash
curl -X POST http://localhost:5678/webhook/facebook/posts \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "pageId": "123456789012345",
    "message": "Happy Friday! Weekend special menu is here 🎉",
    "published": false,
    "scheduledPublishTime": 1718467200
  }'
```

### Response

```json
{
  "success": true,
  "postId": "123456789012345_987654321098765",
  "permalink": "https://www.facebook.com/yourpage/posts/987654321098765",
  "publishedAt": "2026-06-08T14:30:00Z"
}
```

---

## Workflow 2: Post Facebook Comment

### Endpoint
```
POST /facebook/comments
```

### Purpose
Comment on Facebook posts or reply to existing comments.

### Request Body

```json
{
  "objectId": "123456789012345_987654321098765",
  "message": "Thank you for your feedback! We appreciate your support 🙏",
  "attachmentUrl": "https://example.com/response-image.jpg"
}
```

### Required Fields
- `objectId` - Post ID or Comment ID to reply to
- `message` - Comment text

### Optional Fields
- `attachmentUrl` - Image or GIF URL
- `attachmentShareUrl` - URL to share in comment

### Example Requests

#### Simple Comment
```bash
curl -X POST http://localhost:5678/webhook/facebook/comments \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "objectId": "123456789012345_987654321098765",
    "message": "Thank you for visiting us! Hope to see you again soon 😊"
  }'
```

#### Comment with Image
```bash
curl -X POST http://localhost:5678/webhook/facebook/comments \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "objectId": "123456789012345_987654321098765",
    "message": "Here is what our dish looks like! 📸",
    "attachmentUrl": "https://example.com/dish-photo.jpg"
  }'
```

#### Reply to Comment
```bash
curl -X POST http://localhost:5678/webhook/facebook/comments \
  -H 'X-N8N-API-Key: your-secret-key' \
  -H 'Authorization: Bearer your-facebook-access-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "objectId": "987654321098765_456789012345678",
    "message": "Absolutely! We are open until 10 PM tonight 🕙"
  }'
```

### Response

```json
{
  "success": true,
  "commentId": "987654321098765_456789012345678",
  "message": "Thank you for visiting us! Hope to see you again soon 😊",
  "createdTime": "2026-06-08T14:35:00Z"
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
- Facebook Page access token
- Required permissions:
  - `pages_manage_posts`
  - `pages_read_engagement`
  - `pages_manage_engagement`
  - `publish_to_groups` (for groups)

---

## Setup Instructions

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing
3. Add necessary products (Pages API)
4. Configure app settings

### Step 2: Get Page Access Token

```bash
# Get user access token first
https://www.facebook.com/v18.0/dialog/oauth?
  client_id=YOUR_APP_ID
  &redirect_uri=YOUR_REDIRECT_URI
  &scope=pages_manage_posts,pages_read_engagement

# Exchange for page access token
curl -X GET \
  'https://graph.facebook.com/v18.0/me/accounts?access_token=USER_TOKEN'
```

### Step 3: Get Page ID

```bash
curl -X GET \
  'https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_TOKEN'
```

### Step 4: Import Workflows

1. Import `post-facebook-content-workflow.json`
2. Import `post-facebook-comment-workflow.json`
3. Assign `SUPABASE-EDGE-API-KEY` credential
4. Configure backend URLs
5. Activate workflows

---

## Use Cases

### 1. Daily Specials
Post daily menu updates:
```json
{
  "pageId": "123456789012345",
  "message": "Today's lunch special: Grilled Chicken Caesar Salad 🥗\n\nOnly $12.99!\nAvailable until 3 PM",
  "photoUrl": "https://cdn.example.com/caesar-salad.jpg",
  "published": true
}
```

### 2. Event Announcements
Share upcoming events:
```json
{
  "pageId": "123456789012345",
  "message": "Live Jazz Night this Friday! 🎷\n\nStarting at 8 PM\nNo cover charge\nReservations recommended",
  "link": "https://example.com/events/jazz-night",
  "published": true
}
```

### 3. Customer Engagement
Respond to customer inquiries:
```json
{
  "objectId": "123456789012345_987654321098765",
  "message": "We're open Monday-Saturday 11 AM - 10 PM, and Sunday 12 PM - 9 PM. See you soon! 🍽️"
}
```

### 4. Promotional Content
Share special offers:
```json
{
  "pageId": "123456789012345",
  "message": "🎉 SUMMER SPECIAL 🎉\n\nGet 20% off all appetizers this week!\nDine-in only\nMention this post to redeem",
  "photoUrl": "https://cdn.example.com/summer-promo.jpg",
  "published": true
}
```

### 5. Behind-the-Scenes
Share kitchen and staff content:
```json
{
  "pageId": "123456789012345",
  "message": "Meet Chef Maria! She's been with us for 10 years and creates all our amazing specials 👨‍🍳",
  "videoUrl": "https://cdn.example.com/chef-maria-interview.mp4",
  "published": true
}
```

---

## Content Best Practices

### Post Timing
- **Weekdays:** 1-4 PM for maximum engagement
- **Weekends:** 12-1 PM
- **Avoid:** Early mornings (before 8 AM)

### Content Mix (80/20 Rule)
- 80% valuable content (tips, behind-scenes, customer stories)
- 20% promotional content

### Media Guidelines
- **Photos:** 1200x630px (link shares), 1200x1200px (photo posts)
- **Videos:** 1280x720px minimum, MP4 format
- **File Size:** Max 4GB for videos
- **Length:** Videos under 2 minutes perform best

### Text Best Practices
- Keep posts concise (100-250 characters optimal)
- Ask questions to encourage engagement
- Use emojis strategically (not excessively)
- Include call-to-action
- Break text into short paragraphs

### Hashtags
- Use 1-2 relevant hashtags
- Mix branded and trending hashtags
- Don't overuse (unlike Instagram)

---

## Rate Limits

| Action | Limit |
|--------|-------|
| Posts per day | 50 |
| Comments per hour | 100 |
| API calls per hour | 200 (per user token) |
| Scheduled posts | 75 pending max |

---

## Error Handling

### Common Errors

**190 - Access Token Error**
- Token expired or invalid
- Missing required permissions
- User revoked access

**200 - Permission Denied**
- Missing page role
- Feature not available for page type
- Content violates policies

**368 - Temporarily Blocked**
- Rate limit exceeded
- Suspicious activity detected
- Wait 24 hours

**100 - Invalid Parameter**
- Invalid page ID
- Malformed message
- Invalid media URL

---

## Troubleshooting

### Issue: Post Not Publishing

**Solution:**
1. Verify page access token permissions
2. Check if page has posting restrictions
3. Ensure content meets community standards
4. Verify media URLs are accessible

### Issue: Cannot Comment

**Solution:**
1. Check comment permissions on page
2. Verify object ID is correct
3. Ensure comments are enabled on post
4. Check for spam filters

### Issue: Scheduled Post Failed

**Solution:**
1. Verify timestamp is in future (10 min minimum)
2. Maximum 75 scheduled posts allowed
3. Check page publishing permissions
4. Ensure media is still accessible

### Issue: Token Expired

**Solution:**
1. Page tokens don't expire (if long-lived)
2. Renew user token periodically
3. Implement token refresh mechanism
4. Monitor token expiration dates

---

## Backend Requirements

Supabase Edge Functions needed:

```typescript
// Facebook Posts Backend
POST /functions/v1/facebook/posts
  - Validate access token
  - Upload media (if provided)
  - Create page post
  - Handle scheduling
  - Return post details

// Facebook Comments Backend
POST /functions/v1/facebook/comments
  - Validate access token
  - Post comment
  - Handle nested replies
  - Upload attachments
  - Moderate content
```

---

## Advanced Features

### Geographic Targeting
```json
{
  "pageId": "123456789012345",
  "message": "Special offer for Boston area only!",
  "targeting": {
    "geo_locations": {
      "cities": [
        {"key": "2490299", "name": "Boston"}
      ]
    }
  }
}
```

### Age/Gender Targeting
```json
{
  "targeting": {
    "age_min": 21,
    "age_max": 65,
    "genders": [1]
  }
}
```

### Interest Targeting
```json
{
  "targeting": {
    "interests": [
      {"id": "6003139266461", "name": "Food & dining"}
    ]
  }
}
```

---

## Files

- `post-facebook-content-workflow.json` - Post content workflow
- `post-facebook-comment-workflow.json` - Post comment workflow
- `README.md` - This file

---

## Related Documentation

- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Page API](https://developers.facebook.com/docs/pages-api)
- [Marketing API](https://developers.facebook.com/docs/marketing-apis)

---

**Environment:** Development  
**Last Tested:** 2026-06-08  
**Status:** ✅ Ready for Testing

**Note:** Requires Facebook Page admin/editor role and appropriate app permissions. Personal profiles cannot be managed via Graph API.
