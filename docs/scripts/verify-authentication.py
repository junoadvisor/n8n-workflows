#!/usr/bin/env python3
"""
Verify Authentication Configuration in n8n Workflows

This script checks that all workflows properly implement authentication
according to each provider's requirements.
"""

import json
import glob
from pathlib import Path

# Expected authentication configuration for each provider
AUTH_REQUIREMENTS = {
    'toast': {
        'headers': ['Authorization', 'Toast-Restaurant-External-ID', 'Content-Type'],
        'auth_type': 'Bearer + Custom Header'
    },
    'google': {
        'headers': ['Authorization'],
        'optional_headers': ['Content-Type'],
        'auth_type': 'OAuth 2.0 Bearer'
    },
    'yelp': {
        'headers': ['Authorization'],
        'auth_type': 'Bearer Token (API Key)'
    },
    'opentable': {
        'headers': ['Authorization'],
        'auth_type': 'OAuth 2.0 Bearer'
    },
    'resy': {
        'headers': ['Authorization'],
        'recommended_headers': ['User-Agent', 'Origin', 'Referer'],
        'auth_type': 'Custom (ResyAPI api_key="...")'
    },
    'instagram': {
        'headers': ['Authorization', 'Content-Type'],
        'auth_type': 'OAuth 2.0 Bearer (Facebook)'
    },
    'facebook': {
        'headers': ['Authorization', 'Content-Type'],
        'auth_type': 'OAuth 2.0 Bearer'
    }
}

def check_workflow_auth(filepath):
    """Check authentication configuration in a workflow file."""
    with open(filepath, 'r') as f:
        workflow = json.load(f)
    
    # Find HTTP Request node
    http_nodes = [n for n in workflow.get('nodes', []) 
                  if n.get('type') == 'n8n-nodes-base.httpRequest']
    
    if not http_nodes:
        return None, "No HTTP Request node found"
    
    node = http_nodes[0]
    params = node.get('parameters', {})
    
    # Get authentication type
    auth_type = params.get('authentication', 'none')
    
    # Get headers
    header_params = params.get('headerParameters', {}).get('parameters', [])
    header_names = [h.get('name') for h in header_params]
    
    # Check if sendHeaders is true
    send_headers = params.get('sendHeaders', False)
    
    # Check if Authorization header forwards from webhook
    auth_header = next((h for h in header_params if h.get('name') == 'Authorization'), None)
    auth_forwards = False
    if auth_header:
        value = auth_header.get('value', '')
        auth_forwards = '$json.headers.authorization' in value or '$json.headers.Authorization' in value
    
    return {
        'auth_type': auth_type,
        'send_headers': send_headers,
        'headers': header_names,
        'auth_forwards': auth_forwards,
        'node_name': node.get('name', 'HTTP Request')
    }, None

def verify_provider(provider, workflows):
    """Verify authentication for a provider."""
    requirements = AUTH_REQUIREMENTS.get(provider, {})
    required_headers = requirements.get('headers', [])
    optional_headers = requirements.get('optional_headers', [])
    recommended_headers = requirements.get('recommended_headers', [])
    auth_type_name = requirements.get('auth_type', 'Unknown')
    
    print(f"\n{'='*80}")
    print(f"Provider: {provider.upper()}")
    print(f"Auth Type: {auth_type_name}")
    print(f"{'='*80}")
    
    for workflow_file in workflows:
        print(f"\n📄 {workflow_file}")
        
        config, error = check_workflow_auth(workflow_file)
        
        if error:
            print(f"  ❌ ERROR: {error}")
            continue
        
        # Check authentication type
        if config['auth_type'] != 'none':
            print(f"  ⚠️  WARNING: auth_type is '{config['auth_type']}' (should be 'none' for manual header management)")
        else:
            print(f"  ✅ Auth type: {config['auth_type']} (correct)")
        
        # Check sendHeaders
        if not config['send_headers']:
            print(f"  ❌ sendHeaders: {config['send_headers']} (should be true)")
        else:
            print(f"  ✅ sendHeaders: {config['send_headers']}")
        
        # Check Authorization header forwarding
        if not config['auth_forwards']:
            print(f"  ❌ Authorization header not forwarding from webhook")
        else:
            print(f"  ✅ Authorization header forwards from webhook")
        
        # Check required headers
        print(f"\n  Required Headers:")
        for header in required_headers:
            if header in config['headers']:
                print(f"    ✅ {header}")
            else:
                print(f"    ❌ {header} (MISSING)")
        
        # Check optional headers
        if optional_headers:
            print(f"\n  Optional Headers:")
            for header in optional_headers:
                if header in config['headers']:
                    print(f"    ✅ {header}")
                else:
                    print(f"    ⚠️  {header} (not configured)")
        
        # Check recommended headers
        if recommended_headers:
            print(f"\n  Recommended Headers:")
            for header in recommended_headers:
                if header in config['headers']:
                    print(f"    ✅ {header}")
                else:
                    print(f"    ⚠️  {header} (not configured - recommended for {provider})")
        
        # Show all configured headers
        print(f"\n  All Configured Headers ({len(config['headers'])}):")
        for header in config['headers']:
            print(f"    - {header}")

def main():
    print("="*80)
    print("n8n Workflows Authentication Verification")
    print("="*80)
    
    base_dir = Path('.')
    
    # Group workflows by provider
    workflows_by_provider = {}
    for provider in AUTH_REQUIREMENTS.keys():
        pattern = f"{provider}/*-workflow.json"
        workflows = list(base_dir.glob(pattern))
        if workflows:
            workflows_by_provider[provider] = [str(w) for w in workflows]
    
    if not workflows_by_provider:
        print("\n❌ No workflows found!")
        return
    
    # Verify each provider
    for provider, workflows in sorted(workflows_by_provider.items()):
        verify_provider(provider, workflows)
    
    # Summary
    print(f"\n\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"\nTotal Providers Checked: {len(workflows_by_provider)}")
    print(f"Total Workflows Verified: {sum(len(w) for w in workflows_by_provider.values())}")
    
    print("\n📚 Authentication Requirements:")
    for provider, requirements in sorted(AUTH_REQUIREMENTS.items()):
        print(f"\n  {provider.upper()}:")
        print(f"    Type: {requirements['auth_type']}")
        print(f"    Required Headers: {', '.join(requirements['headers'])}")
        if 'recommended_headers' in requirements:
            print(f"    Recommended Headers: {', '.join(requirements['recommended_headers'])}")
    
    print("\n\n✅ Verification complete!")
    print("\nFor detailed authentication configuration, see:")
    print("  - AUTHENTICATION-GUIDE.md")
    print("  - Each provider's README.md")

if __name__ == '__main__':
    main()
