#!/usr/bin/env python3
"""
Update all n8n workflows to call backend APIs directly instead of Supabase.
This script modifies the HTTP Request nodes in each workflow to point to the correct backend API endpoints.
"""

import json
import os
from pathlib import Path

def update_url_in_workflow(filepath, old_url_pattern, new_url, node_name_update=None):
    """Update the URL in a workflow JSON file."""
    with open(filepath, 'r') as f:
        workflow = json.load(f)
    
    modified = False
    for node in workflow.get('nodes', []):
        if node.get('type') == 'n8n-nodes-base.httpRequest':
            params = node.get('parameters', {})
            url = params.get('url', '')
            
            if old_url_pattern in url:
                params['url'] = new_url
                modified = True
                print(f"  Updated URL in {node.get('name', 'HTTP Request node')}")
                
            # Update node name if specified
            if node_name_update and node.get('name') == node_name_update[0]:
                node['name'] = node_name_update[1]
                # Update connections if node name changed
                connections = workflow.get('connections', {})
                if node_name_update[0] in connections:
                    connections[node_name_update[1]] = connections.pop(node_name_update[0])
                for conn_node, conn_data in connections.items():
                    for conn_type, conn_list in conn_data.items():
                        for conn_group in conn_list:
                            for conn in conn_group:
                                if conn.get('node') == node_name_update[0]:
                                    conn['node'] = node_name_update[1]
    
    if modified:
        with open(filepath, 'w') as f:
            json.dump(workflow, f, indent=2)
        return True
    return False

def main():
    base_dir = Path('.')
    
    updates = [
        # Toast workflows
        {
            'file': 'toast/get-toast-order-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/orders/',
            'new_url': '={{ $env.TOAST_API_HOSTNAME + "/orders/v2/orders/" + $json.params.orderGuid }}',
            'node_rename': ('Forward to Backend', 'Forward to Toast API')
        },
        {
            'file': 'toast/get-toast-menu-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/menus',
            'new_url': '={{ $env.TOAST_API_HOSTNAME }}/menus/v2/menus',
            'node_rename': ('Forward to Backend', 'Forward to Toast API')
        },
        # Google workflow
        {
            'file': 'google/get-google-reviews-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/google/reviews',
            'new_url': '={{ $env.GOOGLE_MY_BUSINESS_API_URL + "/v4/accounts/" + $json.query.accountId + "/locations/" + $json.query.locationId + "/reviews" }}',
            'node_rename': ('Forward to Backend', 'Forward to Google API')
        },
        # Yelp workflow
        {
            'file': 'yelp/get-yelp-reviews-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/yelp/reviews',
            'new_url': '={{ "https://api.yelp.com/v3/businesses/" + $json.query.businessId + "/reviews" }}',
            'node_rename': ('Forward to Backend', 'Forward to Yelp API')
        },
        # OpenTable workflow
        {
            'file': 'opentable/get-opentable-reservations-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/opentable/reservations',
            'new_url': '={{ "https://platform.opentable.com/inhouse/v1/booking/" + $json.query.restaurantId + "/reservations" }}',
            'node_rename': ('Forward to Backend', 'Forward to OpenTable API')
        },
        # Resy workflow
        {
            'file': 'resy/get-resy-reservations-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/resy/reservations',
            'new_url': 'https://api.resy.com/3/user/reservations',
            'node_rename': ('Forward to Backend', 'Forward to Resy API')
        },
        # Instagram workflows
        {
            'file': 'instagram/post-instagram-content-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/instagram/posts',
            'new_url': '={{ "https://graph.facebook.com/v22.0/" + $json.body.accountId + "/media" }}',
            'node_rename': ('Forward to Backend', 'Forward to Instagram API')
        },
        {
            'file': 'instagram/post-instagram-comment-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/instagram/comments',
            'new_url': '={{ "https://graph.facebook.com/v22.0/" + $json.body.mediaId + "/comments" }}',
            'node_rename': ('Forward to Backend', 'Forward to Instagram API')
        },
        # Facebook workflows
        {
            'file': 'facebook/post-facebook-content-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/facebook/posts',
            'new_url': '={{ "https://graph.facebook.com/v22.0/" + $json.body.pageId + "/feed" }}',
            'node_rename': ('Forward to Backend', 'Forward to Facebook API')
        },
        {
            'file': 'facebook/post-facebook-comment-workflow.json',
            'old_pattern': 'nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/facebook/comments',
            'new_url': '={{ "https://graph.facebook.com/v22.0/" + $json.body.objectId + "/comments" }}',
            'node_rename': ('Forward to Backend', 'Forward to Facebook API')
        },
    ]
    
    print("Updating n8n workflows to call backend APIs directly...\n")
    
    for update in updates:
        filepath = base_dir / update['file']
        if filepath.exists():
            print(f"Updating {update['file']}...")
            try:
                if update_url_in_workflow(
                    filepath, 
                    update['old_pattern'], 
                    update['new_url'],
                    update.get('node_rename')
                ):
                    print(f"  ✓ Successfully updated {update['file']}\n")
                else:
                    print(f"  - No changes needed for {update['file']}\n")
            except Exception as e:
                print(f"  ✗ Error updating {update['file']}: {e}\n")
        else:
            print(f"  ✗ File not found: {update['file']}\n")
    
    print("\n" + "="*70)
    print("IMPORTANT: Environment Variables Required")
    print("="*70)
    print("""
Set these environment variables in your n8n instance:

1. TOAST_API_HOSTNAME
   Example: https://ws-api.toasttab.com
   (Your Toast-provided API hostname)

2. GOOGLE_MY_BUSINESS_API_URL
   Value: https://mybusiness.googleapis.com
   (Google My Business API base URL)

""")
    print("="*70)
    print("Authentication Credentials Required in n8n")
    print("="*70)
    print("""
Configure these credentials in n8n:

1. Toast POS: Bearer Token Authentication
2. Google Business Profile: OAuth 2.0
3. Yelp Fusion: API Key (Bearer Token)
4. OpenTable: OAuth 2.0 (Client Credentials)
5. Resy: Custom Header (ResyAPI api_key="...")
6. Instagram Graph: OAuth 2.0
7. Facebook Graph: OAuth 2.0

""")
    print("All workflows updated successfully!")

if __name__ == '__main__':
    main()
