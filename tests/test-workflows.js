#!/usr/bin/env node
/**
 * n8n Workflows Test Script
 * 
 * Tests all workflows with configurable mock or real endpoints
 * 
 * Usage:
 *   node tests/test-workflows.js --mock          # Test with mock server
 *   node tests/test-workflows.js --real          # Test with real n8n instance
 *   node tests/test-workflows.js --provider toast # Test specific provider
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  mockMode: process.argv.includes('--mock'),
  realMode: process.argv.includes('--real'),
  specificProvider: process.argv.find(arg => arg.startsWith('--provider'))?.split('=')[1],
  
  // Mock server configuration
  mockServer: {
    host: 'localhost',
    port: 3000,
    baseUrl: 'http://localhost:3000'
  },
  
  // Real n8n configuration
  n8n: {
    host: process.env.N8N_HOST || 'localhost',
    port: process.env.N8N_PORT || 5678,
    baseUrl: process.env.N8N_URL || 'http://localhost:5678',
    webhookKey: process.env.N8N_WEBHOOK_KEY || 'test-webhook-key'
  }
};

// Default to mock mode if neither specified
if (!config.mockMode && !config.realMode) {
  config.mockMode = true;
  console.log('ℹ️  No mode specified, defaulting to --mock mode\n');
}

// Test definitions for each provider
const tests = {
  toast: [
    {
      name: 'POST Toast Order',
      method: 'POST',
      path: '/webhook/toast/orders',
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-toast-token',
        'Toast-Restaurant-External-ID': 'mock-restaurant-guid',
        'Content-Type': 'application/json'
      },
      body: {
        orderGuid: 'test-order-123',
        customer: { name: 'Test Customer' },
        items: [{ name: 'Test Item', quantity: 1 }]
      }
    }
  ],
  
  google: [
    {
      name: 'GET Google Reviews',
      method: 'GET',
      path: '/webhook/google/reviews',
      query: { accountId: '123', locationId: '456', pageSize: '10' },
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-google-token'
      }
    },
    {
      name: 'PUT Google Review Reply',
      method: 'PUT',
      path: '/webhook/google/reviews/reply',
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-google-token',
        'Content-Type': 'application/json'
      },
      body: {
        accountId: '123',
        locationId: '456',
        reviewId: 'review-789',
        comment: 'Thank you for your review!'
      }
    }
  ],
  
  yelp: [
    {
      name: 'GET Yelp Reviews',
      method: 'GET',
      path: '/webhook/yelp/reviews',
      query: { businessId: 'test-business-123', limit: '10' },
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-yelp-api-key'
      }
    }
  ],
  
  opentable: [
    {
      name: 'GET OpenTable Reservations',
      method: 'GET',
      path: '/webhook/opentable/reservations',
      query: { restaurantId: '123', startDate: '2026-06-01' },
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-opentable-token'
      }
    }
  ],
  
  resy: [
    {
      name: 'GET Resy Reservations',
      method: 'GET',
      path: '/webhook/resy/reservations',
      query: { venueId: '123' },
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'ResyAPI api_key="mock-resy-key"'
      }
    }
  ],
  
  instagram: [
    {
      name: 'POST Instagram Content',
      method: 'POST',
      path: '/webhook/instagram/posts',
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-facebook-token',
        'Content-Type': 'application/json'
      },
      body: {
        accountId: 'instagram-account-123',
        mediaType: 'IMAGE',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post'
      }
    },
    {
      name: 'POST Instagram Comment',
      method: 'POST',
      path: '/webhook/instagram/comments',
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-facebook-token',
        'Content-Type': 'application/json'
      },
      body: {
        mediaId: 'media-456',
        message: 'Test comment'
      }
    }
  ],
  
  facebook: [
    {
      name: 'POST Facebook Content',
      method: 'POST',
      path: '/webhook/facebook/posts',
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-facebook-page-token',
        'Content-Type': 'application/json'
      },
      body: {
        pageId: 'facebook-page-123',
        message: 'Test post message'
      }
    },
    {
      name: 'POST Facebook Comment',
      method: 'POST',
      path: '/webhook/facebook/comments',
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer mock-facebook-page-token',
        'Content-Type': 'application/json'
      },
      body: {
        objectId: 'post-789',
        message: 'Test comment'
      }
    }
  ]
};

// Helper function to make HTTP request
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Build full URL with query parameters
function buildUrl(baseUrl, path, query) {
  const url = new URL(path, baseUrl);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url;
}

// Run a single test
async function runTest(provider, test) {
  const baseUrl = config.mockMode ? config.mockServer.baseUrl : config.n8n.baseUrl;
  const url = buildUrl(baseUrl, test.path, test.query);
  
  const options = {
    method: test.method,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    headers: test.headers || {}
  };
  
  console.log(`  Testing: ${test.name}`);
  console.log(`    ${test.method} ${url.href}`);
  
  try {
    const response = await makeRequest(options, test.body);
    
    // Check response
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`    ✅ Success (${response.statusCode})`);
      
      // Try to parse response
      try {
        const parsed = JSON.parse(response.body);
        console.log(`    📦 Response: ${JSON.stringify(parsed).substring(0, 100)}...`);
      } catch (e) {
        console.log(`    📦 Response: ${response.body.substring(0, 100)}...`);
      }
    } else if (response.statusCode === 400 || response.statusCode === 401) {
      console.log(`    ⚠️  Expected error (${response.statusCode})`);
      console.log(`    📦 Response: ${response.body.substring(0, 100)}...`);
    } else {
      console.log(`    ❌ Unexpected status (${response.statusCode})`);
      console.log(`    📦 Response: ${response.body}`);
    }
    
    return { success: true, statusCode: response.statusCode };
  } catch (error) {
    console.log(`    ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log('='.repeat(70));
  console.log('n8n Workflows Test Suite');
  console.log('='.repeat(70));
  console.log();
  console.log(`Mode: ${config.mockMode ? '🧪 MOCK' : '🌐 REAL'}`);
  console.log(`Target: ${config.mockMode ? config.mockServer.baseUrl : config.n8n.baseUrl}`);
  console.log();
  
  if (config.mockMode) {
    console.log('⚠️  Mock mode: Make sure mock server is running on', config.mockServer.baseUrl);
    console.log('   Start mock server: node tests/mock-server.js');
    console.log();
  }
  
  const providers = config.specificProvider 
    ? [config.specificProvider] 
    : Object.keys(tests);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    byProvider: {}
  };
  
  for (const provider of providers) {
    if (!tests[provider]) {
      console.log(`❌ Unknown provider: ${provider}`);
      continue;
    }
    
    console.log(`\n📦 ${provider.toUpperCase()}`);
    console.log('-'.repeat(70));
    
    const providerTests = tests[provider];
    results.byProvider[provider] = { total: 0, passed: 0, failed: 0 };
    
    for (const test of providerTests) {
      const result = await runTest(provider, test);
      results.total++;
      results.byProvider[provider].total++;
      
      if (result.success) {
        results.passed++;
        results.byProvider[provider].passed++;
      } else {
        results.failed++;
        results.byProvider[provider].failed++;
      }
      
      console.log(); // Blank line between tests
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('Test Summary');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log();
  
  // Per-provider summary
  console.log('By Provider:');
  Object.entries(results.byProvider).forEach(([provider, stats]) => {
    console.log(`  ${provider}: ${stats.passed}/${stats.total} passed`);
  });
  
  console.log('\n' + '='.repeat(70));
  
  // Exit code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Show usage if --help
if (process.argv.includes('--help')) {
  console.log(`
Usage: node tests/test-workflows.js [options]

Options:
  --mock              Test with mock server (default)
  --real              Test with real n8n instance
  --provider=NAME     Test specific provider only
  --help              Show this help message

Environment Variables:
  N8N_URL             n8n instance URL (default: http://localhost:5678)
  N8N_WEBHOOK_KEY     Webhook authentication key
  N8N_HOST            n8n hostname (default: localhost)
  N8N_PORT            n8n port (default: 5678)

Examples:
  node tests/test-workflows.js --mock
  node tests/test-workflows.js --real
  node tests/test-workflows.js --mock --provider=google
  N8N_URL=https://n8n.example.com node tests/test-workflows.js --real
`);
  process.exit(0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
