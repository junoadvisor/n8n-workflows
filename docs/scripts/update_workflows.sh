#!/bin/bash

# Script to update all n8n workflows to call backend APIs directly instead of Supabase

echo "Updating n8n workflows to call backend APIs directly..."

# Toast workflows - Update to use Toast API hostname
echo "Updating Toast workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/orders/|={{ $env.TOAST_API_HOSTNAME }}/orders/v2/orders/|g' toast/get-toast-order-workflow.json
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/menus|={{ $env.TOAST_API_HOSTNAME }}/menus/v2/menus|g' toast/get-toast-menu-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to Toast API"|g' toast/*.json

# Google workflows - Update to use Google Business Profile API
echo "Updating Google workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/google/reviews|={{ $env.GOOGLE_MY_BUSINESS_API_URL }}/v4/accounts/{{ $json.query.accountId }}/locations/{{ $json.query.locationId }}/reviews|g' google/get-google-reviews-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to Google API"|g' google/*.json

# Yelp workflows - Update to use Yelp Fusion API
echo "Updating Yelp workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/yelp/reviews|https://api.yelp.com/v3/businesses/={{ $json.query.businessId }}/reviews|g' yelp/get-yelp-reviews-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to Yelp API"|g' yelp/*.json

# OpenTable workflows - Update to use OpenTable Platform API
echo "Updating OpenTable workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/opentable/reservations|https://platform.opentable.com/inhouse/v1/booking/={{ $json.query.restaurantId }}/reservations|g' opentable/get-opentable-reservations-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to OpenTable API"|g' opentable/*.json

# Resy workflows - Update to use Resy API
echo "Updating Resy workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/resy/reservations|https://api.resy.com/3/user/reservations|g' resy/get-resy-reservations-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to Resy API"|g' resy/*.json

# Instagram workflows - Update to use Instagram Graph API
echo "Updating Instagram workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/instagram/posts|https://graph.facebook.com/v22.0/={{ $json.body.accountId }}/media|g' instagram/post-instagram-content-workflow.json
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/instagram/comments|https://graph.facebook.com/v22.0/={{ $json.body.mediaId }}/comments|g' instagram/post-instagram-comment-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to Instagram API"|g' instagram/*.json

# Facebook workflows - Update to use Facebook Graph API
echo "Updating Facebook workflows..."
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/facebook/posts|https://graph.facebook.com/v22.0/={{ $json.body.pageId }}/feed|g' facebook/post-facebook-content-workflow.json
sed -i '' 's|https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/facebook/comments|https://graph.facebook.com/v22.0/={{ $json.body.objectId }}/comments|g' facebook/post-facebook-comment-workflow.json
sed -i '' 's|"Forward to Backend"|"Forward to Facebook API"|g' facebook/*.json

echo "All workflows updated successfully!"
echo ""
echo "Environment variables required:"
echo "  - TOAST_API_HOSTNAME: Your Toast API hostname (e.g., https://ws-api.toasttab.com)"
echo "  - GOOGLE_MY_BUSINESS_API_URL: Google My Business API base URL (https://mybusiness.googleapis.com)"
echo ""
echo "Authentication credentials required in n8n:"
echo "  - Toast: Bearer token authentication"
echo "  - Google: OAuth 2.0"
echo "  - Yelp: Bearer token authentication"
echo "  - OpenTable: OAuth 2.0"
echo "  - Resy: Custom header authentication"
echo "  - Instagram/Facebook: OAuth 2.0"
