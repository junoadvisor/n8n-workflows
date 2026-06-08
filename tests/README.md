# n8n Workflows Testing

This directory contains test scripts and mock data for testing n8n workflows.

## Quick Start

### 1. Start Mock Server

```bash
node tests/mock-server.js
```

The mock server will start on `http://localhost:3000` and simulate all workflow endpoints.

### 2. Run Tests

```bash
# Test all workflows with mock server
node tests/test-workflows.js --mock

# Test specific provider
node tests/test-workflows.js --mock --provider=google

# Test with real n8n instance (requires n8n running)
node tests/test-workflows.js --real
```

## Test Scripts

### `test-workflows.js`

Main test runner that sends HTTP requests to workflow webhook endpoints.

**Features**:
- ✅ Tests all providers (Toast, Google, Yelp, OpenTable, Resy, Instagram, Facebook)
- ✅ Supports mock mode (mock server) and real mode (actual n8n)
- ✅ Configurable via environment variables
- ✅ Detailed output with response status and body
- ✅ Per-provider test results

**Usage**:

```bash
# Mock mode (default)
node tests/test-workflows.js --mock

# Real n8n instance
N8N_URL=http://localhost:5678 node tests/test-workflows.js --real

# Specific provider
node tests/test-workflows.js --mock --provider=toast

# Custom webhook key
N8N_WEBHOOK_KEY=your-key node tests/test-workflows.js --real
```

**Environment Variables**:
- `N8N_URL`: n8n instance URL (default: `http://localhost:5678`)
- `N8N_HOST`: n8n hostname (default: `localhost`)
- `N8N_PORT`: n8n port (default: `5678`)
- `N8N_WEBHOOK_KEY`: Webhook authentication key (default: `test-webhook-key`)

### `mock-server.js`

Simulates n8n webhook endpoints with realistic responses.

**Features**:
- ✅ All provider endpoints
- ✅ Authentication validation (webhook key + provider auth)
- ✅ Realistic mock responses
- ✅ Error handling (401 Unauthorized, 400 Bad Request, 404 Not Found)
- ✅ CORS support
- ✅ Request logging

**Usage**:

```bash
# Start on default port 3000
node tests/mock-server.js

# Custom port
MOCK_PORT=8080 node tests/mock-server.js
```

**Environment Variables**:
- `MOCK_PORT`: Server port (default: `3000`)
- `MOCK_HOST`: Server host (default: `localhost`)

## Test Flow

```
Test Script → Mock Server → Mock Response
     ↓
  Validate
     ↓
  Report Results
```

## Mock Authentication

All requests require:

1. **Webhook Key** (header): `X-N8N-API-Key: test-webhook-key`
2. **Provider Auth** (header): `Authorization: Bearer <token>`
   - Resy uses: `Authorization: ResyAPI api_key="<key>"`

## Expected Responses

### Success (2xx)

```json
{
  "success": true,
  "data": { ... }
}
```

### Unauthorized (401)

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication credentials"
}
```

### Bad Request (400)

```json
{
  "error": "Bad Request",
  "message": "Missing required parameters"
}
```

### Not Found (404)

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

## Testing Workflow

1. **Start mock server**:
   ```bash
   node tests/mock-server.js
   ```

2. **In another terminal, run tests**:
   ```bash
   node tests/test-workflows.js --mock
   ```

3. **Check output**:
   - ✅ Green checks = success
   - ⚠️ Yellow warnings = expected errors (400/401)
   - ❌ Red X = unexpected errors

4. **Test specific provider**:
   ```bash
   node tests/test-workflows.js --mock --provider=google
   ```

## Testing with Real n8n

### Prerequisites

1. n8n instance running (e.g., `docker compose up` or `npm run start`)
2. Workflows imported into n8n
3. Webhooks activated

### Steps

1. **Set environment variables**:
   ```bash
   export N8N_URL=http://localhost:5678
   export N8N_WEBHOOK_KEY=your-actual-webhook-key
   ```

2. **Run tests**:
   ```bash
   node tests/test-workflows.js --real
   ```

3. **Check n8n execution logs**:
   - Open n8n UI: `http://localhost:5678`
   - Navigate to "Executions"
   - Verify workflow runs

## Example Output

```
======================================================================
n8n Workflows Test Suite
======================================================================

Mode: 🧪 MOCK
Target: http://localhost:3000

📦 GOOGLE
----------------------------------------------------------------------
  Testing: GET Google Reviews
    GET http://localhost:3000/webhook/google/reviews?accountId=123&locationId=456&pageSize=10
    ✅ Success (200)
    📦 Response: {"reviews":[{"reviewId":"review-1","reviewer":{"displayName":"Jane Smith"}...

  Testing: PUT Google Review Reply
    PUT http://localhost:3000/webhook/google/reviews/reply
    ✅ Success (200)
    📦 Response: {"reviewId":"review-1","reply":{"comment":"Thank you for your review!"...

======================================================================
Test Summary
======================================================================
Total Tests: 12
✅ Passed: 12
❌ Failed: 0

By Provider:
  toast: 3/3 passed
  google: 2/2 passed
  yelp: 1/1 passed
  opentable: 1/1 passed
  resy: 1/1 passed
  instagram: 2/2 passed
  facebook: 2/2 passed

======================================================================
```

## Troubleshooting

### Mock Server Not Responding

```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill existing process
kill -9 <PID>

# Or use different port
MOCK_PORT=8080 node tests/mock-server.js
```

### Tests Failing with Real n8n

1. **Check n8n is running**:
   ```bash
   curl http://localhost:5678
   ```

2. **Verify workflows are active**:
   - Open n8n UI
   - Check each workflow is activated

3. **Check webhook URLs**:
   - In n8n, click on Webhook node
   - Copy "Test URL" or "Production URL"
   - Verify it matches test script paths

4. **Check credentials**:
   - Verify webhook key matches
   - Check provider credentials are configured

### Connection Refused

```bash
# Make sure mock server is running
node tests/mock-server.js

# In another terminal
node tests/test-workflows.js --mock
```

## Adding New Tests

1. **Add test definition** in `test-workflows.js`:

```javascript
const tests = {
  newProvider: [
    {
      name: 'Test Name',
      method: 'GET',
      path: '/webhook/newprovider/endpoint',
      query: { param: 'value' },
      headers: {
        'X-N8N-API-Key': config.n8n.webhookKey,
        'Authorization': 'Bearer token'
      },
      body: { ... } // For POST/PUT
    }
  ]
};
```

2. **Add mock response** in `mock-server.js`:

```javascript
const mockResponses = {
  newProvider: {
    endpoint: {
      success: true,
      data: { ... }
    }
  }
};

// In handleRequest function:
if (pathname === '/webhook/newprovider/endpoint' && method === 'GET') {
  response = mockResponses.newProvider.endpoint;
}
```

3. **Run tests**:

```bash
node tests/test-workflows.js --mock --provider=newProvider
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Workflows

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Start Mock Server
        run: node tests/mock-server.js &
        
      - name: Wait for Mock Server
        run: sleep 5
      
      - name: Run Tests
        run: node tests/test-workflows.js --mock
```

## Best Practices

1. ✅ Always test with mock server first
2. ✅ Test each provider individually when debugging
3. ✅ Check mock server logs for request details
4. ✅ Use environment variables for configuration
5. ✅ Add new tests when adding new workflows
6. ❌ Don't commit real credentials
7. ❌ Don't rely on external APIs in CI/CD (use mocks)

## Files

- `test-workflows.js` - Main test runner
- `mock-server.js` - Mock HTTP server
- `README.md` - This file
- `mocks/` - Mock response data (if needed)

## Next Steps

1. Add more comprehensive test cases
2. Add request/response validation schemas
3. Add performance benchmarks
4. Add integration tests with actual n8n instance
5. Add error scenario tests
6. Add load testing scripts
