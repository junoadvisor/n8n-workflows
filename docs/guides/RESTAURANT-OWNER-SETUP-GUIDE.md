# Restaurant Owner Setup Guide

**Version:** 1.0.0  
**Last Updated:** 2026-06-08  
**Audience:** Restaurant Owners and Managers

Welcome to NeuralTable! This guide will help you connect your restaurant systems to NeuralTable. Follow these steps to configure each integration.

---

## Table of Contents

- [Getting Started](#getting-started)
- [1. Toast POS Integration](#1-toast-pos-integration)
- [2. Google Business Profile Integration](#2-google-business-profile-integration)
- [3. Yelp Integration](#3-yelp-integration)
- [4. OpenTable Integration](#4-opentable-integration)
- [5. Resy Integration](#5-resy-integration)
- [6. Instagram Integration](#6-instagram-integration)
- [7. Facebook Integration](#7-facebook-integration)
- [What Happens Next](#what-happens-next)
- [Security & Privacy](#security--privacy)
- [Support](#support)

---

## Getting Started

### What You'll Need

- Access to your NeuralTable portal
- Admin access to your restaurant systems (Toast, Google, Yelp, etc.)
- About 30-60 minutes to complete all integrations
- Email addresses and passwords for each service

### How This Works

1. **Review this guide** - Understand what information you'll need
2. **Log in to each provider** - Access your Toast, Google, Yelp accounts
3. **Find credentials** - Locate API keys, tokens, or OAuth settings
4. **Copy to NeuralTable** - Paste credentials into the NeuralTable portal
5. **We handle the rest** - NeuralTable securely stores and manages your credentials

**Important:** You only need to do this once. NeuralTable will automatically refresh credentials as needed.

---

## 1. Toast POS Integration

### What You'll Get
- Real-time order data
- Menu synchronization
- Restaurant configuration
- Customer information

### Prerequisites
- Toast POS account with API access
- Restaurant GUID (provided by Toast)

### Step-by-Step Instructions

#### Step 1: Log in to Toast
1. Go to [Toast Developer Portal](https://pos.toasttab.com)
2. Sign in with your Toast credentials
3. Click on **Settings** > **API Settings**

#### Step 2: Generate API Credentials
1. Click **Create New API Key**
2. Give it a name: "NeuralTable Integration"
3. Select permissions:
   - ✅ Read Orders
   - ✅ Read Menu
   - ✅ Read Restaurant Configuration
4. Click **Generate Key**
5. **Important:** Copy the key immediately (you won't see it again)

#### Step 3: Find Your Restaurant GUID
1. In Toast, go to **Settings** > **Restaurant Info**
2. Look for "External Restaurant ID" or "Restaurant GUID"
3. Copy this value

#### Step 4: Enter in NeuralTable Portal
1. Log in to [NeuralTable Portal](https://customer.neuraltable.ai)
2. Go to **Integrations** > **Toast POS**
3. Click **Configure**
4. Enter the following:
   - **API Key:** Paste your Toast API key
   - **Restaurant GUID:** Paste your Restaurant GUID
   - **Environment:** Select "Production" or "Sandbox"
5. Click **Save & Test Connection**
6. Wait for the green checkmark ✅

### What Gets Synced
- Orders (real-time)
- Menu items and pricing
- Restaurant configuration
- Customer data (if enabled)

---

## 2. Google Business Profile Integration

### What You'll Get
- Customer reviews
- Ability to respond to reviews
- Review analytics
- Rating trends

### Prerequisites
- Google Business Profile (formerly Google My Business)
- Business owner or manager role
- Google account with access

### Step-by-Step Instructions

#### Step 1: Verify Your Google Business Profile
1. Go to [Google Business Profile](https://business.google.com)
2. Sign in with your Google account
3. Verify you can see your restaurant listing
4. Note your Location ID (in the URL after `/location/`)

#### Step 2: Enable API Access
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing): "NeuralTable Integration"
3. Enable the following APIs:
   - **Google Business Profile API**
   - **Google My Business API**
4. Click **Enable** for each

#### Step 3: Create OAuth Credentials
1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Configure consent screen:
   - App name: "NeuralTable"
   - User support email: Your email
   - Authorized domains: `neuraltable.ai`
4. Create credentials:
   - Application type: **Web application**
   - Name: "NeuralTable Integration"
   - Authorized redirect URIs: `https://customer.neuraltable.ai/auth/google/callback`
5. Copy the **Client ID** and **Client Secret**

#### Step 4: Enter in NeuralTable Portal
1. Log in to NeuralTable Portal
2. Go to **Integrations** > **Google Business Profile**
3. Click **Configure**
4. Enter the following:
   - **Location ID:** Your Google Business Location ID
   - **Client ID:** Paste your Google Client ID
   - **Client Secret:** Paste your Google Client Secret
5. Click **Authorize with Google**
6. Sign in to Google and grant permissions
7. Wait for the green checkmark ✅

### What Gets Synced
- All customer reviews
- Review ratings and comments
- Reviewer information
- Review photos
- Your business responses

---

## 3. Yelp Integration

### What You'll Get
- Customer reviews (up to 3 most recent)
- Review ratings
- Reviewer details
- Ability to respond to reviews (requires Yelp Partner access)

### Prerequisites
- Yelp Business account
- Business claimed on Yelp
- API access (free for reviews)

### Step-by-Step Instructions

#### Step 1: Create Yelp Developer Account
1. Go to [Yelp Developers](https://www.yelp.com/developers)
2. Click **Create App**
3. Sign in with your Yelp account

#### Step 2: Create New App
1. Click **Create New App**
2. Fill in the form:
   - **App Name:** NeuralTable Integration
   - **Industry:** Restaurant Technology
   - **Contact Email:** Your email
   - **Description:** Integration for review management
3. Click **Create App**

#### Step 3: Get API Key
1. After creating the app, you'll see your **API Key**
2. Copy the API Key (starts with your app name)

#### Step 4: Find Your Business ID
1. Go to your Yelp business page
2. Look at the URL: `https://www.yelp.com/biz/restaurant-name-city`
3. The business ID is the last part: `restaurant-name-city`
4. Copy this value

#### Step 5: Enter in NeuralTable Portal
1. Log in to NeuralTable Portal
2. Go to **Integrations** > **Yelp**
3. Click **Configure**
4. Enter the following:
   - **API Key:** Paste your Yelp API key
   - **Business ID:** Paste your Business ID
5. Click **Save & Test Connection**
6. Wait for the green checkmark ✅

### What Gets Synced
- 3 most recent reviews (Yelp API limitation)
- Review ratings and text
- Reviewer information
- Review dates

### Responding to Reviews
**Note:** To respond to Yelp reviews, you need **Yelp Partner API** access. Contact your NeuralTable representative to upgrade.

---

## 4. OpenTable Integration

### What You'll Get
- Real-time reservations
- Guest information
- Table assignments
- Reservation status updates

### Prerequisites
- OpenTable restaurant account
- API access (contact OpenTable)
- Client credentials

### Step-by-Step Instructions

#### Step 1: Request API Access
1. Contact OpenTable support: [partners@opentable.com](mailto:partners@opentable.com)
2. Request: "API access for reservation management"
3. Mention: "Integration with NeuralTable"
4. Wait for approval (1-3 business days)

#### Step 2: Get Client Credentials
1. Once approved, OpenTable will send you:
   - **Client ID**
   - **Client Secret**
   - **Restaurant ID**
2. Save these credentials securely

#### Step 3: Find Your Restaurant ID
1. Log in to [OpenTable Manager](https://manager.opentable.com)
2. Go to **Settings** > **Restaurant Info**
3. Copy your **Restaurant ID**

#### Step 4: Enter in NeuralTable Portal
1. Log in to NeuralTable Portal
2. Go to **Integrations** > **OpenTable**
3. Click **Configure**
4. Enter the following:
   - **Client ID:** Paste your OpenTable Client ID
   - **Client Secret:** Paste your Client Secret
   - **Restaurant ID:** Paste your Restaurant ID
   - **Environment:** Select "Production"
5. Click **Save & Test Connection**
6. Wait for the green checkmark ✅

### What Gets Synced
- All reservations (past and upcoming)
- Guest names, phone numbers, emails
- Party size and table assignments
- Special requests and notes
- Reservation status (confirmed, seated, completed, cancelled)

---

## 5. Resy Integration

### What You'll Get
- Real-time reservations
- Guest profiles
- Waitlist management
- Payment information (if enabled)

### Prerequisites
- Resy restaurant account
- API access
- Venue ID

### Step-by-Step Instructions

#### Step 1: Request API Access
1. Contact Resy support: [partners@resy.com](mailto:partners@resy.com)
2. Request: "API access for reservation management"
3. Mention: "Integration with NeuralTable"
4. Wait for approval (1-3 business days)

#### Step 2: Get API Credentials
1. Once approved, Resy will send you:
   - **API Key**
   - **Venue ID**
2. Save these credentials securely

#### Step 3: Find Your Venue ID
1. Log in to [Resy Manager](https://manager.resy.com)
2. Go to **Settings** > **Venue Info**
3. Copy your **Venue ID** (numeric value)

#### Step 4: Enter in NeuralTable Portal
1. Log in to NeuralTable Portal
2. Go to **Integrations** > **Resy**
3. Click **Configure**
4. Enter the following:
   - **API Key:** Paste your Resy API key
   - **Venue ID:** Paste your Venue ID
   - **Environment:** Select "Production"
5. Click **Save & Test Connection**
6. Wait for the green checkmark ✅

### What Gets Synced
- All reservations (past and upcoming)
- Guest details and preferences
- Waitlist entries
- Table types and notes
- Reservation status

---

## 6. Instagram Integration

### What You'll Get
- Post content to Instagram
- Comment on posts
- Reply to comments
- Manage engagement

### Prerequisites
- Instagram Business Account
- Facebook Page connected to Instagram
- Facebook Developer account

### Step-by-Step Instructions

#### Step 1: Convert to Business Account
1. Open Instagram app
2. Go to **Settings** > **Account**
3. Tap **Switch to Professional Account**
4. Select **Business**
5. Connect to your Facebook Page

#### Step 2: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click **My Apps** > **Create App**
3. Select **Business** > **Next**
4. Fill in details:
   - **App Name:** NeuralTable Integration
   - **Contact Email:** Your email
5. Click **Create App**

#### Step 3: Configure Instagram Basic Display
1. In your Facebook App, go to **Products** > **Instagram Basic Display**
2. Click **Create New App**
3. Configure settings:
   - **Valid OAuth Redirect URIs:** `https://customer.neuraltable.ai/auth/instagram/callback`
   - **Deauthorize Callback URL:** `https://customer.neuraltable.ai/auth/instagram/deauthorize`
   - **Data Deletion Request URL:** `https://customer.neuraltable.ai/auth/instagram/delete`
4. Save changes

#### Step 4: Get Credentials
1. In Instagram Basic Display settings, copy:
   - **Instagram App ID**
   - **Instagram App Secret**
2. Get your Instagram Business Account ID:
   - Go to Instagram app > Settings > Account
   - Note your username
   - Your Account ID will be displayed in NeuralTable after authorization

#### Step 5: Enter in NeuralTable Portal
1. Log in to NeuralTable Portal
2. Go to **Integrations** > **Instagram**
3. Click **Configure**
4. Enter the following:
   - **App ID:** Paste your Instagram App ID
   - **App Secret:** Paste your App Secret
5. Click **Authorize with Instagram**
6. Grant permissions when prompted
7. Wait for the green checkmark ✅

### What Gets Synced
- Your Instagram posts
- Comments on your posts
- Engagement metrics
- Follower interactions

---

## 7. Facebook Integration

### What You'll Get
- Post content to Facebook Page
- Comment on posts
- Reply to comments
- Manage page engagement

### Prerequisites
- Facebook Page (not personal profile)
- Page admin or editor role
- Facebook Developer account

### Step-by-Step Instructions

#### Step 1: Verify Facebook Page
1. Go to [Facebook](https://facebook.com)
2. Navigate to your restaurant's Facebook Page
3. Verify you have **Admin** or **Editor** role
4. Note your Page ID (in the URL: `/pages/restaurant-name/PAGE_ID`)

#### Step 2: Create Facebook App (if not done for Instagram)
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click **My Apps** > **Create App**
3. Select **Business** > **Next**
4. Fill in details:
   - **App Name:** NeuralTable Integration
   - **Contact Email:** Your email
5. Click **Create App**

#### Step 3: Add Facebook Login Product
1. In your Facebook App, go to **Products**
2. Find **Facebook Login** > Click **Set Up**
3. Configure settings:
   - **Valid OAuth Redirect URIs:** `https://customer.neuraltable.ai/auth/facebook/callback`
4. Save changes

#### Step 4: Configure Permissions
1. Go to **App Review** > **Permissions and Features**
2. Request the following permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_manage_engagement`
3. Submit for review (usually approved within 24 hours)

#### Step 5: Get Credentials
1. Go to **Settings** > **Basic**
2. Copy:
   - **App ID**
   - **App Secret**
3. Get your Page ID:
   - Go to your Facebook Page
   - Click **About** > **More Info**
   - Copy **Page ID**

#### Step 6: Enter in NeuralTable Portal
1. Log in to NeuralTable Portal
2. Go to **Integrations** > **Facebook**
3. Click **Configure**
4. Enter the following:
   - **App ID:** Paste your Facebook App ID
   - **App Secret:** Paste your App Secret
   - **Page ID:** Paste your Page ID
5. Click **Authorize with Facebook**
6. Grant permissions when prompted
7. Wait for the green checkmark ✅

### What Gets Synced
- Your Facebook Page posts
- Comments on your posts
- Page engagement metrics
- Follower interactions

---

## What Happens Next

### After Configuration

1. **NeuralTable validates credentials**
   - Tests connection to each service
   - Verifies permissions are correct
   - Shows green checkmark ✅ for success

2. **Automatic token management**
   - NeuralTable securely stores your credentials
   - Automatically refreshes expired tokens
   - No action needed from you

3. **Data synchronization begins**
   - Orders, reservations, and reviews start flowing
   - Historical data is imported (where supported)
   - Real-time updates begin

4. **You're all set!**
   - Access your NeuralTable dashboard
   - View unified data from all systems
   - AI insights and automations activate

### Timeline

| Integration | Initial Sync | Real-time Updates |
|-------------|--------------|-------------------|
| **Toast POS** | 5-10 minutes | Immediate |
| **Google Reviews** | 10-15 minutes | Every 4 hours |
| **Yelp Reviews** | 5 minutes | Every 24 hours |
| **OpenTable** | 15-20 minutes | Immediate |
| **Resy** | 15-20 minutes | Immediate |
| **Instagram** | 10 minutes | Every hour |
| **Facebook** | 10 minutes | Every hour |

---

## Security & Privacy

### How We Protect Your Data

✅ **Encrypted Storage**
- All credentials encrypted at rest in our secure database
- Industry-standard AES-256 encryption
- Keys managed by NeuralTable security team

✅ **Secure Communication**
- All API calls use HTTPS/TLS
- No credentials transmitted in plain text
- OAuth 2.0 for supported services

✅ **Access Control**
- Only you can access your credentials in the portal
- NeuralTable team cannot view your API keys
- Role-based access for your team members

✅ **Automatic Token Refresh**
- Tokens refreshed before expiration
- No service interruptions
- Secure refresh token management

✅ **Audit Logging**
- All access logged for security
- Suspicious activity alerts
- Compliance with data protection regulations

### What We Store

| Data Type | Storage Location | Retention |
|-----------|------------------|-----------|
| **API Keys** | Encrypted database | Until you disconnect |
| **OAuth Tokens** | Encrypted database | Auto-refreshed |
| **Restaurant Data** | Database | Per your data policy |
| **Reviews** | Database | Configurable |
| **Reservations** | Database | Configurable |

### Your Rights

- **Access:** View your credentials anytime
- **Update:** Change credentials anytime
- **Disconnect:** Remove integrations anytime
- **Delete:** Request data deletion (we'll comply within 30 days)

---

## Support

### Need Help?

**NeuralTable Support Team**
- Email: [support@neuraltable.ai](mailto:support@neuraltable.ai)
- Phone: 1-800-NEURAL-1
- Live Chat: Available in NeuralTable Portal
- Hours: Monday-Friday, 9 AM - 6 PM EST

### Common Issues

#### Issue: "Connection Failed"
**Solution:**
1. Double-check credentials are copied correctly
2. Verify API key has correct permissions
3. Check if service is experiencing downtime
4. Contact support if issue persists

#### Issue: "Invalid API Key"
**Solution:**
1. Regenerate API key from provider
2. Ensure no spaces before/after when pasting
3. Verify key hasn't expired
4. Check environment (Production vs Sandbox)

#### Issue: "Authorization Denied"
**Solution:**
1. Verify you're signed in to correct account
2. Check admin/manager permissions
3. Re-authorize from NeuralTable Portal
4. Clear browser cookies and try again

### Provider Support

If you have issues with provider accounts:

- **Toast POS:** [support@toasttab.com](mailto:support@toasttab.com)
- **Google:** [Google Business Support](https://support.google.com/business)
- **Yelp:** [Yelp Business Support](https://www.yelp-support.com)
- **OpenTable:** [partners@opentable.com](mailto:partners@opentable.com)
- **Resy:** [partners@resy.com](mailto:partners@resy.com)
- **Instagram:** [Instagram Help Center](https://help.instagram.com/business)
- **Facebook:** [Facebook Business Help](https://www.facebook.com/business/help)

---

## Appendix

### Glossary

- **API Key:** A secret code that identifies your application to a service
- **OAuth:** A secure authorization method that doesn't share passwords
- **Token:** A temporary credential that grants access to a service
- **GUID:** Globally Unique Identifier - a unique ID for your restaurant
- **Client ID/Secret:** Credentials for OAuth applications
- **Webhook:** A way for services to notify NeuralTable of updates in real-time

### Video Tutorials

Coming soon! Check the NeuralTable Portal for video walkthroughs of each integration.

---

**Last Updated:** 2026-06-08  
**Version:** 1.0.0  
**Document Owner:** NeuralTable Customer Success Team

**Questions?** Email [support@neuraltable.ai](mailto:support@neuraltable.ai)
